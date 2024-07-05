import {
  Clique,
  findAllCliques,
  findConnectedComponents,
  findEventOverlaps,
} from "./event_overlap_functions";
import { ModifiableEvent } from "./types";

export function getPositions<T>(events: ModifiableEvent<T>[]) {
  /**
   * Overlaps is a graph where each event is a node and each edge is an overlap between two events
   * For each event, which other events is it overlapping with?
   */
  const overlaps = findEventOverlaps(events);

  /**
   * Each component is an array of event indexes that are connected (like an island in a graph)
   */
  const components = findConnectedComponents(overlaps);

  /**
   * The clique of a graph is a subset of nodes where each node is connected to every other node, i.e. where each event overlaps with every other event
   * Each event can be part of many cliques, but this represents the largest clique for an event, so the max over
   */
  let maxCliques: Clique[] = [];

  /**
   * An improved lookup table for the number of columns for a given event
   */
  let numCols: Record<
    /**
     * Event index
     */
    number,
    /**
     * Number of columns
     */
    number
  > = {};

  // create the numCols and find the maxCliques
  components.forEach((component, index) => {
    const cliques = findAllCliques(overlaps, component);

    const maxCliqueSizeForComponent = cliques.reduce((max, clique) => {
      return clique.length > max ? clique.length : max;
    }, 0);

    component.forEach((index) => {
      numCols[index] = maxCliqueSizeForComponent;

      const cliquesForEvent = cliques.filter((clique) =>
        clique.includes(index)
      );
      const maxCliqueForEvent = cliquesForEvent.reduce((max, clique) => {
        return clique.length > max.length ? clique : max;
      }, []);
      // console.log("Max Clique for Event", index, maxClique);

      maxCliqueForEvent.sort(sortEvent);
      if (
        !maxCliques
          .map((clique) => clique.join(""))
          .includes(maxCliqueForEvent.join(""))
      ) {
        maxCliques.push(maxCliqueForEvent);
      }
    });
  });

  /**
   * Our sorting algo for the events
   * sort by start time and the by end time
   */
  function sortEvent(a: number, b: number) {
    const startTimeSort = events[a].start.getTime() - events[b].start.getTime();
    if (startTimeSort === 0) {
      return events[a].end.getTime() - events[b].end.getTime();
    }
    return startTimeSort;
  }

  maxCliques.sort((a, b) => {
    if (a.length === 0 || b.length === 0) {
      return 0;
    }
    return sortEvent(a[0], b[0]);
  });

  /**
   * Which row should the event be placed in?
   * This is a lookup table for the vertical position of an event
   * ... vertical as in which y position should the event be placed in
   *
   * But observe this algo works for horizontal positions as well, this is just modelled on the timline view. But it also used for the week calendar where each day is has columns and "horozintalPositions"
   *
   */
  const verticalPositions: Record<
    /**
     * event index
     */
    number,
    /**
     * vertical position
     */
    number
  > = {};

  // construct the vertical positions
  maxCliques.forEach((clique) => {
    const novelPositions = clique.filter(
      (evIndex) => typeof verticalPositions[evIndex] === "undefined"
    );
    const fixedPositions = clique.filter(
      (evIndex) => typeof verticalPositions[evIndex] !== "undefined"
    );

    const verPos: (null | number)[] = [...clique].map(() => null);

    // pin fixed positions
    fixedPositions.forEach((evIndex) => {
      verPos[verticalPositions[evIndex]] = evIndex;
    });

    // add novel positions
    novelPositions.forEach((evIndex) => {
      const nextPos = verPos.findIndex((pos) => pos === null);
      verPos[nextPos] = evIndex;
    });

    verPos.forEach((evIndex, horizontalPos) => {
      if (evIndex === null) {
        return;
      }
      if (typeof verticalPositions[evIndex] === "undefined") {
        // is novel
        verticalPositions[evIndex] = horizontalPos;
      }
    });
  });

  return [verticalPositions, numCols] as const;
}
