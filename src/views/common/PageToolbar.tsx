import React from "react";
import { Link } from "react-router-dom";

interface Step {
  title?: string;
  link?: string;
}

interface PageToolbarProps {
  title: string;
  step1?: Step;
  step2?: Step;
  step3?: Step;
}

const PageToolbar: React.FC<PageToolbarProps> = ({
  title,
  step1,
  step2,
  step3,
}) => {
  // Function to render each step with bullet and link
  const renderStep = (step: Step | undefined) => {
    if (!step) return null;

    return (
      <>
        <li className="breadcrumb-item text-gray-600">
          {step.link ? (
            <Link to={step.link} className="text-gray-600 text-hover-primary">
              {step.title}
            </Link>
          ) : (
            <span>{step.title}</span>
          )}
        </li>
      </>
    );
  };

  return (
    <div className="toolbar mb-5 mb-lg-7" id="kt_toolbar">
      <div className="page-title d-flex flex-column me-3">
        <ul className="breadcrumb breadcrumb-dot fw-semibold text-gray-600 fs-7 my-1">
          <li className="breadcrumb-item text-gray-600">
            <Link
              to="/dashboard"
              className="text-muted text-hover-primary"
            >
              Dashboard
            </Link>
          </li>
          {renderStep(step1)}
          {renderStep(step2)}
          {renderStep(step3)}
        </ul>
        <h1 className="d-flex text-gray-900 fw-bold my-1 fs-3">{title}</h1>
      </div>
    </div>
  );
};

export default PageToolbar;
