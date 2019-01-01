'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'committees',
      getNewHavenCommittees().map((name, i) => ({
        name,
        id: i + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  },
  down: (queryInterface, Sequelize) => {

  }
};

function getNewHavenCommittees() {
  return [
    'Tax Abatement',
    'Education',
    'Human Services',
    'Finance',
    'Public Safety',
    'Legislation',
    'Youth Services',
    'Community Development',
    'Aldermanic Affairs',
    'City Services and Environmental Policy',
  ];
}
