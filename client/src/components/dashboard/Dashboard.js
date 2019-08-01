import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";
import Modal from "../profile/profileModal";
import CreateProfile from "../profile-forms/CreateProfile"
import { loadUser } from "../../actions/auth";
import { getCurrentProfile, deleteAccount } from "../../actions/profile";

const Dashboard = ({
  getCurrentProfile,
  loadUser,
  deleteAccount,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
    loadUser();
  }, [getCurrentProfile, loadUser]);
  const [show, setModalState] = useState(false);
  const showModal = () => {
    setModalState(true);
  };

  const hideModal = () => {
    setModalState(false);
  };
  // profile not resolved
  return loading && profile === null ? (
    <div id="loader" />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {/* someone with no profile has null */}
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <Modal show={show} handleClose={hideModal}  deleteProfile={deleteAccount}/>
          {/* <CreateProfile show={show} handleClose={hideModal}/> */}


          <div className="my-2">
            <button className="btn btn-danger" onClick={() => showModal()}>
              <i className="fas fa-user-minus" /> Delete Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, loadUser }
)(Dashboard);
