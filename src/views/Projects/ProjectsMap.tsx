import React from "react";
import { PageToolbar } from "../common";
import ProjectsMapView from "./ProjectsMapView";

/** /projects-map: every live listing on a map, by state or around a ZIP code. */
const ProjectsMap: React.FC = () => (
  <>
    <PageToolbar title="Projects Map" />
    <div id="kt_content" className="content flex-column-fluid">
      <div className="card"><div className="card-body"><ProjectsMapView /></div></div>
    </div>
  </>
);

export default ProjectsMap;
