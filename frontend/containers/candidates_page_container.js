import { connect } from 'react-redux';
import CandidatesPage from 'src/frontend/pages/candidates_page';

export function mapStateToProps({ notesDocuments }) {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(CandidatesPage);

export default Container;
