import PropTypes from "prop-types";

Loading.propTypes = {
  isLoading: PropTypes.bool,
};

export default function Loading({ isLoading }) {
  return (
    <div
      className={`spinner-border spinner-border-sm mx-1 ${
        isLoading ? "d-flex-inline" : "d-none"
      }`}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
