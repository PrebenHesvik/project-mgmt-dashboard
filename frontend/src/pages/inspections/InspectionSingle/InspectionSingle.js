import { useParams } from "react-router-dom";
import { AssignedEmployees } from "./AssignedEmployees/AssignedEmployees";
import { InspectionDetails } from "./InspectionDetails/InspectionDetails";
import { Comments } from "./Comments/Comments";
import "./inspection-single.scss";

const InspectionSingle = () => {
  const { inspectionId } = useParams();

  return (
    <div id="inspection-single-page">
      <InspectionDetails inspectionId={inspectionId} />
      <AssignedEmployees inspectionId={inspectionId} />
      <Comments inspectionId={inspectionId} />
    </div>
  );
};

export default InspectionSingle;
