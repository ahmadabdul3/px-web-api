import React, { Component, PureComponent } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import NewOfficialModal from 'src/frontend/components/new_official_modal';
import http from 'src/frontend/services/http';
import PoliticianSummaryCard from 'src/frontend/components/politician_summary_card';
import FormInput from 'src/frontend/components/form_input';

import {
  generateValidationStateForForm,
  validateRequiredFields
} from 'src/frontend/services/form_validator';
import FormSelect from 'src/frontend/components/form_select';

export default class HomePage extends Component {
  state = {
    loading: false,
    newOfficialModalOpen: false,
    newCommitteeTermModalOpen: false,
    address: '',
    politicians: {},
    committees: {},
    error: '',
    politicianForNewCommitteeTerm: undefined,
    headerFilter: '',
  }

  componentDidMount() {
    http.get('/politicians').then(res => {
      const { politicians, committees } = this.getPoliticiansAndCommittees(res.politicians);
      this.setState({ politicians, committees, error: '' });
    }).catch(err => {
      this.setState({ error: 'error' });
    });
  }

  getPoliticiansAndCommittees(rawPoliticians) {
    const committees = {};
    const politicians = {};

    rawPoliticians.forEach(p => {
      politicians[p.id] = p;
      committees[p.id] = p.committees;
    });

    return { committees, politicians };
  }

  addNoteDoc = ({ docName }) => {
    this.hideNewNoteDocumentModal();
    this.props.addNotesDocument({ name: docName });
  }

  openNewOfficialModal = () => {
    this.setState({ newOfficialModalOpen: true });
  }

  closeNewOfficialModal = () => {
    this.setState({ newOfficialModalOpen: false });
  }

  saveNewCommitteeTerm = (newCommitteeTerm) => {
    const { committees, politicianForNewCommitteeTerm } = this.state;
    const politicianId = politicianForNewCommitteeTerm.id;
    const committeesForPolitician = [ ...committees[politicianId], newCommitteeTerm ];

    this.setState({
      committees: { ...committees, [politicianId]: committeesForPolitician },
      politicianForNewCommitteeTerm: undefined,
      newCommitteeTermModalOpen: false,
    });
  }

  openNewCommitteeTermModal = (politicianForNewCommitteeTerm) => {
    this.setState({
      politicianForNewCommitteeTerm,
      newCommitteeTermModalOpen: true,
    });
  }

  closeNewCommitteeTermModal = () => {
    this.setState({
      politicianForNewCommitteeTerm: undefined,
      newCommitteeTermModalOpen: false,
    });
  }

  loadAldersIntoDb = () => {
    const alders = aldersJson();
    http.post('/alders/bulk-create', alders).then(res => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
    // http.post('/alders', alders[0]).then(res => {
    //   console.log(res);
    // }).catch((err) => {
    //   console.log(err);
    // });
  }

  searchAddress = () => {
    const { address } = this.state;
    if (!address) return;

    http.get('/address?address=' + address).then((res) => {
      console.log('RESPONSE', res);
      if (res.status === 'err') this.setState({ data: res.message });
      else this.setState({ data: res.data });
    });
  }

  updateAddress = (name, address) => {
    this.setState({ address });
  }

  renderPoliticians() {
    const { politicians, committees } = this.state;
    const headerFilter = this.state.headerFilter.toLowerCase();
    if (politicians.length < 1) return (<div>No Data</div>);

    return Object.keys(politicians).map(politicianId => {
      const p = politicians[politicianId];
      const c = committees[politicianId];

      if (headerFilter) {
        const fullName = `${p.firstName} ${p.middleName} ${p.lastName} ${p.suffix}`.toLowerCase();
        const politicalTitle = `${p.titlePrimary} ${p.levelOfResponsibility} ${p.areaOfResponsibility} ${p.party}`.toLowerCase();

        if (!fullName.includes(headerFilter) && !politicalTitle.includes(headerFilter)) {
          return;
        }
      }

      return (
        <PoliticianSummaryCard
          politician={p}
          committees={c}
          key={p.id}
          addCommitteeTerm={this.openNewCommitteeTermModal}
        />
      );
    });
  }

  changeHeaderFilter = ({ name, value }) => {
    this.setState({ [name]: value });
  }

  render() {
    const {
      address,
      data,
      newOfficialModalOpen,
      newCommitteeTermModalOpen,
      politicianForNewCommitteeTerm,
      headerFilter,
    } = this.state;

    return (
      <div className='home-page'>
        {
          newOfficialModalOpen && (
            <NewOfficialModal hideModal={this.closeNewOfficialModal} />
          )
        }
        {
          newCommitteeTermModalOpen && (
            <NewCommitteeTermModal
              hideModal={this.closeNewCommitteeTermModal}
              politician={politicianForNewCommitteeTerm}
              saveNewCommitteeTerm={this.saveNewCommitteeTerm}
            />
          )
        }
        <header className='home-page__header'>
          <div className='content'>
            <div></div>
            <div className='center'>
              <FormInput
                name='headerFilter'
                labelText='Filter'
                onChange={this.changeHeaderFilter}
                value={headerFilter}
              />
            </div>
            <button className='green-button' onClick={this.openNewOfficialModal}>
              <i className='fas fa-plus' /> New Official
            </button>
          </div>
        </header>
        <section className='home-page__content'>
          <div className='content'>
            {
              this.state.error ?
                <div>Error loading data</div>
                : this.renderPoliticians()
            }
          </div>
        </section>
      </div>
    );
  }
}

class NewCommitteeTermModal extends PureComponent {
  render() {
    const { hideModal, politician, saveNewCommitteeTerm } = this.props;
    const {
      committees,
      firstName,
      middleName,
      lastName,
      titlePrimary,
      levelOfResponsibility,
      areaOfResponsibility
    } = politician;
    const politicianFullName = firstName + ' ' + middleName + ' ' + lastName;
    const politicianTitle = titlePrimary + ', ' + levelOfResponsibility + ' ' + areaOfResponsibility;

    return (
      <div>
        <div className='black-overlay' onClick={hideModal} />
        <div className='committee-management-modal'>
          <div className='modal__form'>
            <div className='form-title'>
              Add To Committee
            </div>
            <div className='form-subtitle'>
              { politicianFullName } - { politicianTitle }
            </div>
            <NewCommitteeTermForm
              closeNewCommitteeTermForm={hideModal}
              saveNewCommitteeTerm={saveNewCommitteeTerm}
              officeHolderTermId={politician.officeHolderTermId}
            />
          </div>
        </div>
      </div>
    );
  }
}

function committeeTermModel(values={}) {
  return {
    committeeId: values.committeeId || '',
    officeHolderTermId: values.officeHolderTermId || '',
    title: values.title || '',
  };
}

function newCommitteeTermFormState() {
  const committeeTerm = committeeTermModel();
  const formValidationState = generateValidationStateForForm({ formFields: committeeTerm });

  return {
    ...committeeTerm,
    ...formValidationState,
  };
}

class NewCommitteeTermForm extends PureComponent {
  // - the officeHolderTermId is a required field but the user doesn't
  //   provide it, it's automatically injected by the code, so no need
  //   to validate it because there's no user-error
  static requiredFields = ['committeeId'];
  state = newCommitteeTermFormState();

  get splitCommitteeValues() {
    const [committeeName, committeeId] = this.state.committeeId.split('**');
    return { committeeId, committeeName };
  }

  onSubmit = (e) => {
    const { officeHolderTermId, saveNewCommitteeTerm } = this.props;
    e.preventDefault();
    const validationResult = this.validateInputs();
    validationResult.formMessage = '';
    this.setState(validationResult);
    if (!validationResult.formValid) return;

    const values = committeeTermModel({
      ...this.state, ...this.splitCommitteeValues, officeHolderTermId
    });
    http.post('/committee-terms', values).then(res => {
      saveNewCommitteeTerm({
        committeeTermId: res.committeeTerm.id,
        committeeTermTitle: res.committeeTerm.title,
        committeeId: res.committeeTerm.committeeId,
        committeeName: this.splitCommitteeValues.committeeName,
      });
    }).catch(err => {
      const errorMessage = err.errors && err.errors[0] && err.errors[0].message || 'There was an error';
      this.setState({ formMessage: errorMessage });
      console.warn(err);
    });

  }

  validateInputs() {
    const { requiredFields } = NewCommitteeTermForm;
    const { state } = this;

    const requiredFieldsResult = validateRequiredFields({ requiredFields, state });
    return { formValid: requiredFieldsResult.isValid, ...requiredFieldsResult.errors };
  }

  onChange = ({ name, value }) => {
    this.setState({ [name]: value })
  }

  render() {
    const { closeNewCommitteeTermForm } = this.props;
    const { formMessage } = this.state;

    return (
      <form className='new-committee-term-form' onSubmit={this.onSubmit}>
        <FormSelect
          labelText='Committee*'
          name='committeeId'
          value={this.state.committeeId}
          onChange={this.onChange}
          message={this.state.committeeIdMessage}
          options={committeeOptions()}
        />
        <FormSelect
          labelText='Title'
          name='title'
          value={this.state.title}
          onChange={this.onChange}
          message={this.state.titleMessage}
          options={[
            { value: 'Chair', label: 'Chair' },
            { value: 'Vice-Chair', label: 'Vice-Chair' },
          ]}
        />
        <div className='form-messages'>
          { formMessage }
        </div>

        <div className='form-buttons'>
          <button
            className='button'
            type='button'
            onClick={closeNewCommitteeTermForm}
          >
            Cancel
          </button>
          <button className='green-button'>
            Save
          </button>
        </div>
      </form>
    );
  }
}

function committeeOptions() {
  return [
    { value: 'Tax Abatement**' + 1, label: 'Tax Abatement' },
    { value: 'Education**' + 2, label: 'Education' },
    { value: 'Human Services**' + 3, label: 'Human Services' },
    { value: 'Finance**' + 4, label: 'Finance' },
    { value: 'Public Safety**' + 5, label: 'Public Safety' },
    { value: 'Legislation**' + 6, label: 'Legislation' },
    { value: 'Youth Services**' + 7, label: 'Youth Services' },
    { value: 'Community Development**' + 8, label: 'Community Development' },
    { value: 'Aldermanic Affairs**' + 9, label: 'Aldermanic Affairs' },
    {
      value: 'City Services and Environmental Policy**' + 10,
      label: 'City Services and Environmental Policy'
    },
  ];
}


// this stuff below here is for when I had that google address finder thing
//
// <div className='form-box'>
//   <FormInput labelText='address' value={address} onChange={this.updateAddress} />
//   <button className='address-search-button' onClick={this.searchAddress}>
//     search
//   </button>
// </div>
// { renderData(data) }
//
// function renderData(data) {
//   if (!data) return;
//   if (!data.result) return;
//   if (!data.result.address_components) return;
//
//   return (
//     <div className='address-results'>
//       {
//         data.result.address_components.map((obj, i) => (
//           <div key={obj + i} className='address-results__group'>
//             {
//               Object.values(obj).map((val, i) => (
//                 <div key={val + i}>
//                   { val }
//                 </div>
//               ))
//             }
//           </div>
//         ))
//       }
//     </div>
//   )
// }
