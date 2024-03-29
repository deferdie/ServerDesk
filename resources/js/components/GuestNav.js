import React from 'react';
import { Link } from 'react-router-dom';

const GuestNav = () => {
  return (
    <div className="w-full px-6 mx-auto flex items-center justify-between">
      <ul className="list-reset flex pt-4">
        <li className="px-2">
          <Link to=""
            className="no-underline text-white"
          >
            Server Desk
          </Link>
        </li>
      </ul>

      <ul className="list-reset flex pt-4">
        <li className="px-4 py-2">
          <Link to="/signin"
            className="no-underline font-medium text-white"
          >Pricing
          </Link>
        </li>

        <li className="px-4 py-2">
          <Link to="/signin"
            className="no-underline font-medium text-white"
          >Sign in
          </Link>
        </li>

        <li className="px-4 py-2 border bg-indigo rounded-full">
          <Link to="/register"
            className="no-underline text-white font-semibold"
          >try it FREE</Link>
        </li>
      </ul>
    </div>
  );
};

export default GuestNav;
