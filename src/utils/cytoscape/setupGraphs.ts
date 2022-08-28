import { processData } from "../node/dataProcessor";
import { styles, reload, setNodeStyles } from "../cytoscape/cytoscapeHelper";
import { getNewCytoscape } from "../cytoscape/cytoscapeGraphCreator";
import { runNodeClick } from "../node/nodeClick";
import { runNodeHover } from "../node/nodeHover";
import { canUseLabels, runNodeLabels } from "../node/nodeLabels";
import { runNodeSort } from "../node/nodeSort";

// @ts-ignore
let nodeFiles = files;
// @ts-ignore
let nodeConnections = connections;
// @ts-ignore
let nodeCurrentFile = currentFile;
// @ts-ignore
let nodeWhitelistSettings: string[] = whitelistSettings;

export const setupMainGraph = (mainGraphElement: HTMLElement | undefined) => {
  if (mainGraphElement) {
    let nodes = processData(nodeFiles, nodeConnections, nodeWhitelistSettings);
    let cy = getNewCytoscape(nodes, styles(canUseLabels), mainGraphElement);

    runNodeHover(cy);
    runNodeLabels(cy);
    runNodeSort(cy);
    runNodeClick(cy, nodes);

    refreshMainGraph(
      cy,
      nodeCurrentFile,
      nodeFiles,
      nodeConnections,
      nodeWhitelistSettings
    );

    return cy;
  }
};

export const setupRelativeGraph = (
  relativeGraphElement: HTMLElement | undefined
) => {
  if (relativeGraphElement) {
    let nodes = processData(
      nodeFiles,
      nodeConnections,
      nodeWhitelistSettings,
      1,
      nodeCurrentFile
    );
    let cyRelative = getNewCytoscape(
      nodes,
      styles(canUseLabels),
      relativeGraphElement
    );

    runNodeSort(cyRelative);
    runNodeClick(cyRelative, nodes);

    refreshLocalGraph(
      cyRelative,
      nodeCurrentFile,
      nodeFiles,
      nodeConnections,
      nodeWhitelistSettings
    );

    return cyRelative;
  }
};

export const refreshMainGraph = (
  mainCy: any,
  nodeCurrentFile: any,
  nodeFiles: any,
  nodeConnections: any,
  nodeWhitelistSettings: any
) => {
  let nodes = processData(nodeFiles, nodeConnections, nodeWhitelistSettings);

  mainCy.elements().remove();
  mainCy.add(nodes);

  setNodeStyles(mainCy, nodeCurrentFile);

  reload(mainCy, "reload");
};

export const refreshLocalGraph = (
  relativeCy: any,
  nodeCurrentFile: any,
  nodeFiles: any,
  nodeConnections: any,
  nodeWhitelistSettings: any,
  localDepth: number = 1
) => {
  let nodes = processData(
    nodeFiles,
    nodeConnections,
    nodeWhitelistSettings,
    localDepth,
    nodeCurrentFile
  );

  relativeCy.elements().remove();
  relativeCy.add(nodes);

  // turn off old click listener to update with new depth nodes
  relativeCy.off("click");
  runNodeClick(relativeCy, nodes);

  setNodeStyles(relativeCy, nodeCurrentFile);

  reload(relativeCy, "reload");
};
