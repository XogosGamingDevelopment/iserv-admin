interface InfoBlockProps {
  label: string;
  value: string | number | undefined;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ label, value }) => {
  return (
    <div className="col-md-3">
      <div className="fs-6 px-3">
        <div className="text-muted">{label}</div>
        <div className="fs-5 fw-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
};

export default InfoBlock;
