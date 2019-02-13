import React, { PureComponent } from 'react';

export default class PoliticianSummaryCard extends PureComponent {
  static defaultProps = {
    committees: [],
  };

  render() {
    const { politician, addCommitteeTerm, committees, editPolitician } = this.props;
    const {
      firstName,
      middleName,
      lastName,
      suffix,
      levelOfResponsibility,
      areaOfResponsibility,
      titlePrimary,
      party,
      missionStatement,
    } = politician;
    const fullName = `${firstName} ${middleName} ${lastName}, ${suffix}`;
    const politicalTitle = `${titlePrimary}, ${levelOfResponsibility} ${areaOfResponsibility} - ${party}`;

    return (
      <div key={politician.id} className='politician-summary-card'>
        <div className='edit-politician' onClick={() => { editPolitician(politician); }}>
          <i className='fas fa-pencil-alt' />
          Edit
        </div>
        <div className='name'>
          { fullName }
        </div>
        <div>
          { politicalTitle }
        </div>
        <div className='contact-info'>
          <ContactInfo politician={politician} />
        </div>
        <div className='politician-summary-card__mission-statement'>
          <h3>
            Mission Statement
          </h3>
          { missionStatement }
        </div>
        <div className='committees'>
          <h3>
            Committees
          </h3>
          {
            committees.map((c, i) => <Committee key={c.committeeTermId} committee={c} />)
          }
          <button className='button' onClick={() => { addCommitteeTerm(politician); }}>
            add committee
          </button>
        </div>
      </div>
    );
  }
}

class Committee extends PureComponent {
  render() {
    const { committee } = this.props;

    return (
      <div className='committee-row'>
          { committee.committeeName }
          {
            committee.committeeTermTitle ? ` --- (${committee.committeeTermTitle})` : ''
          }
      </div>
    )
  }
}

class ContactInfo extends PureComponent {
  render() {
    const { politician } = this.props;
    const contactInfoKeys = {
      email: 'email',
      phone: 'phone',
      streetAddress: 'street address',
      city: 'city',
      state: 'state',
      zipCode: 'zip code',
    };

    return Object.keys(politician).map((key, i) => {
      const ciKey = contactInfoKeys[key];
      if (!ciKey) return;
      return (
        <div key={politician.id + key}>
          <span className='key'>{ciKey}</span>
          <span>{politician[key]}</span>
        </div>
      );
    });
  }
}
