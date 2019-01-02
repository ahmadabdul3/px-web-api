import React, { PureComponent } from 'react';

export default class PoliticianSummaryCard extends PureComponent {
  render() {
    const { politician, manageCommittees } = this.props;

    return (
      <div key={politician.id} className='card'>
        <div className='name'>
          <span>
            { politician.firstName }
          </span> <span>
            { politician.middleName }
          </span> <span>
            { politician.lastName }
          </span> <span>
            { politician.suffix }
          </span>
        </div>
        <div>
          <span>
            { politician.levelOfResponsibility }
          </span> <span>
            { politician.areaOfResponsibility },
          </span> <span>
            { politician.titlePrimary } -
          </span> <span>
            { politician.party }
          </span>
        </div>
        <div className='contact-info'>
          <ContactInfo politician={politician} />
        </div>
        <div className='buttons'>
          <button className='button' onClick={() => { manageCommittees(politician); }}>
            manage committees
          </button>
        </div>
      </div>
    );
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
