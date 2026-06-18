import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const registryPath = path.join(repoRoot, "surfaces", "registry.json");
const packagePath = path.join(repoRoot, "package.json");
const allowedKinds = new Set(["component", "surface", "workflow", "lab"]);
const allowedCaptureStatuses = new Set(["ready", "pending", "mounted-only"]);

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const relPath = (value) => path.join(repoRoot, value);
const exists = (value) => fs.existsSync(relPath(value));
const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const registry = readJson(registryPath);
const packageJson = readJson(packagePath);
const scripts = packageJson.scripts || {};
const errors = [];
const warnings = [];

const addError = (surfaceId, message) => {
  errors.push(surfaceId ? `${surfaceId}: ${message}` : message);
};

if (registry.version !== 1) {
  addError(null, "registry.version must be 1");
}

if (!Array.isArray(registry.surfaces) || registry.surfaces.length === 0) {
  addError(null, "registry.surfaces must be a non-empty array");
}

const surfaces = Array.isArray(registry.surfaces) ? registry.surfaces : [];
const ids = new Set();
const duplicateIds = new Set();

for (const surface of surfaces) {
  if (!isObject(surface)) {
    addError(null, "each registry surface must be an object");
    continue;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(surface.id || "")) {
    addError(surface.id || "unknown", "id must be kebab-case");
  }

  if (ids.has(surface.id)) {
    duplicateIds.add(surface.id);
  }
  ids.add(surface.id);
}

for (const id of duplicateIds) {
  addError(id, "duplicate surface id");
}

for (const surface of surfaces) {
  if (!isObject(surface)) {
    continue;
  }

  const id = surface.id || "unknown";

  if (!isNonEmptyString(surface.title)) {
    addError(id, "title is required");
  }

  if (!allowedKinds.has(surface.kind)) {
    addError(id, `kind must be one of ${Array.from(allowedKinds).join(", ")}`);
  }

  if (!isNonEmptyString(surface.status)) {
    addError(id, "status is required");
  }

  if (!isObject(surface.dimensions)) {
    addError(id, "dimensions must be an object");
  } else {
    for (const axis of ["width", "height"]) {
      if (!Number.isInteger(surface.dimensions[axis]) || surface.dimensions[axis] <= 0) {
        addError(id, `dimensions.${axis} must be a positive integer`);
      }
    }
  }

  if (!isNonEmptyString(surface.source)) {
    addError(id, "source is required");
  } else if (!exists(surface.source)) {
    addError(id, `source path does not exist: ${surface.source}`);
  }

  if (isNonEmptyString(surface.source) && isNonEmptyString(surface.compositionId)) {
    const sourceText = fs.existsSync(relPath(surface.source))
      ? fs.readFileSync(relPath(surface.source), "utf8")
      : "";
    if (!sourceText.includes(`data-composition-id="${surface.compositionId}"`)) {
      addError(id, `source does not contain data-composition-id="${surface.compositionId}"`);
    }
  }

  if (!isObject(surface.import)) {
    addError(id, "import is required");
  } else {
    if (!isNonEmptyString(surface.import.type)) {
      addError(id, "import.type is required");
    }
    if (!isNonEmptyString(surface.import.src)) {
      addError(id, "import.src is required");
    } else if (!exists(surface.import.src)) {
      addError(id, `import.src path does not exist: ${surface.import.src}`);
    }
    if (!isNonEmptyString(surface.import.selector)) {
      addError(id, "import.selector is required");
    }
  }

  if (!isObject(surface.capture)) {
    addError(id, "capture is required");
  } else {
    if (!allowedCaptureStatuses.has(surface.capture.status)) {
      addError(id, `capture.status must be one of ${Array.from(allowedCaptureStatuses).join(", ")}`);
    }

    if (surface.capture.status === "ready") {
      if (!isNonEmptyString(surface.capture.script)) {
        addError(id, "ready capture requires capture.script");
      } else if (!scripts[surface.capture.script]) {
        addError(id, `capture script is missing from package.json: ${surface.capture.script}`);
      }

      if (!isNonEmptyString(surface.capture.selector)) {
        addError(id, "ready capture requires capture.selector");
      }

      if (!isNonEmptyString(surface.capture.path)) {
        addError(id, "ready capture requires capture.path");
      } else if (!exists(surface.capture.path)) {
        addError(id, `capture path does not exist: ${surface.capture.path}`);
      }
    } else if (!isNonEmptyString(surface.capture.note)) {
      warnings.push(`${id}: non-ready capture should include capture.note`);
    }
  }

  if (!isNonEmptyString(surface.prototypeNote)) {
    addError(id, "prototypeNote is required");
  } else if (!exists(surface.prototypeNote)) {
    addError(id, `prototypeNote path does not exist: ${surface.prototypeNote}`);
  }

  if (!Array.isArray(surface.tags) || surface.tags.length === 0) {
    addError(id, "tags must be a non-empty array");
  }

  if (!Array.isArray(surface.dependencies)) {
    addError(id, "dependencies must be an array");
  } else {
    for (const dependency of surface.dependencies) {
      if (!ids.has(dependency)) {
        addError(id, `dependency does not exist in registry: ${dependency}`);
      }
    }
  }

  if (!Array.isArray(surface.sourceEvidence) || surface.sourceEvidence.length === 0) {
    addError(id, "sourceEvidence must be a non-empty array");
  }

  if (!isNonEmptyString(surface.assetDecision)) {
    addError(id, "assetDecision is required");
  }
}

if (errors.length > 0) {
  console.error(`Surface registry check failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  if (warnings.length > 0) {
    console.error(`Warnings: ${warnings.length}`);
    for (const warning of warnings) {
      console.error(`- ${warning}`);
    }
  }
  process.exit(1);
}

const readyCaptures = surfaces.filter((surface) => surface.capture?.status === "ready").length;
const components = surfaces.filter((surface) => surface.kind === "component").length;
const workflows = surfaces.filter((surface) => surface.kind === "workflow").length;

console.log(`Surface registry OK: ${surfaces.length} surfaces, ${components} components, ${workflows} workflows, ${readyCaptures} ready captures.`);
if (warnings.length > 0) {
  console.log(`Warnings: ${warnings.length}`);
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}
