import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Footer } from 'common-front';
import { FOXHUNT_ORG_MANAGEMENT_PORTAL } from '../../../utils/commonConstants';
import { selectFooterFixed } from '../../../store/selectors/mainLayoutSelectors';

const mapStateToProps = createStructuredSelector({
  footerFixed: selectFooterFixed,
  portalName: () => FOXHUNT_ORG_MANAGEMENT_PORTAL,
});

export default connect(mapStateToProps)(Footer);
