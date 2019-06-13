import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//alerts destructured from props
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));
Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
  alerts: state.alert
});
//connect() is a glue that enables a component to have direct access to app state
export default connect(mapStateToProps)(Alert);
