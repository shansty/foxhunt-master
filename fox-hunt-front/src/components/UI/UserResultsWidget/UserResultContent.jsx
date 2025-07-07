import UserResultCard from '../UserResultCard/UserResultCard';
import PropTypes from 'prop-types';
import React from 'react';

import { getColorFromConfig } from 'src/utils/index';

const UserResultsContent = (props) => {
  const { userResults, header, config } = props;

  if (!userResults) {
    return;
  }

  return (
    <div>
      <div key={'result-header'}>
        <UserResultCard userResult={header} isHeader={true} />
      </div>
      {userResults.slice(0, userResults.length).map((result) => (
        <div key={result.user.id}>
          <UserResultCard
            userResult={result}
            numberColor={getColorFromConfig(config, result.user.id)}
          />
        </div>
      ))}
    </div>
  );
};

UserResultsContent.propTypes = {
  userResults: PropTypes.array.isRequired,
  header: PropTypes.shape({}),
  config: PropTypes.shape({
    colors: PropTypes.array,
  }),
};

UserResultsContent.defaultProps = { config: { color: [] } };

export default UserResultsContent;
