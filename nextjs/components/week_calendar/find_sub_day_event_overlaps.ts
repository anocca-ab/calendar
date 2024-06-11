export type Graph = number[][];
type Component = number[];
type Clique = number[];

// Helper function to perform Depth-First Search (DFS)
const dfs = (
  graph: Graph,
  node: number,
  visited: boolean[],
  component: Component,
) => {
  visited[node] = true;
  component.push(node);

  for (let neighbor of graph[node]) {
    if (!visited[neighbor]) {
      dfs(graph, neighbor, visited, component);
    }
  }
};

// Function to find all connected components
export const findConnectedComponents = (graph: Graph): Component[] => {
  const visited: boolean[] = [];

  for (let i = 0; i < graph.length; i++) {
    visited[i] = false;
  }

  const components: Component[] = [];

  for (let node in graph) {
    const index = parseInt(node);
    if (!visited[index]) {
      const component: Component = [];
      dfs(graph, index, visited, component);
      components.push(component);
    }
  }

  return components;
};

// Helper function to check if a set of nodes form a clique
const isClique = (graph: Graph, nodes: number[]): boolean => {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (!graph[nodes[i]].includes(nodes[j])) {
        return false;
      }
    }
  }
  return true;
};

export const findAllCliques = (graph: Graph, component: Component): Clique[] => {
  const cliques: Clique[] = [];

  // Brute-force approach to find all cliques
  // Generate all possible subsets and check if they form a clique
  const generateSubsets = (set: number[]): number[][] => {
    const subsets: number[][] = [[]];

    for (let el of set) {
      const newSubsets = subsets.map(subset => subset.concat(el));
      subsets.push(...newSubsets);
    }

    return subsets;
  };

  const subsets = generateSubsets(component);

  for (let subset of subsets) {
    if (isClique(graph, subset)) {
      cliques.push(subset);
    }
  }

  return cliques;
};
