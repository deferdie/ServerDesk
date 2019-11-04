import React from 'react';
import DocumentTitle from 'react-document-title';
import GuestNav from '../components/GuestNav';

const Welcome = () => {
  return (
    <DocumentTitle title={`Welcome - ${window.App.name}`}>
      <div className="flex flex-col min-h-screen homepage-background">
        <div className="automation-background"></div>
        <GuestNav />

        <div className="flex flex-1 flex-col items-left">
          <h1 className="p-2 text-white homepage-heading">
            Hello <span>Developer!</span> Are you ready to deploy your app!
          </h1>

          <div>
            <button type="button" className="p-3 text-black bg-white font-bold homepage-heading-signup-button">
              GET STARTED
            </button>
          </div>
        </div>

      </div>
    </DocumentTitle>
  );
};

export default Welcome;
