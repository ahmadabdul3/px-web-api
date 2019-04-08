import React, { Component, PureComponent } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import NewOfficialModal from 'src/frontend/components/new_official_modal';
import EditOfficeHolderModal from 'src/frontend/components/edit_office_holder_modal';
import http from 'src/frontend/services/http';
import PoliticianSummaryCard from 'src/frontend/components/politician_summary_card';
import FormInput from 'src/frontend/components/form_input';
import auth from 'src/services/authorization';

import {
  generateValidationStateForForm,
  validateRequiredFields
} from 'src/frontend/services/form_validator';
import FormSelect from 'src/frontend/components/form_select';

export default class HomePage extends Component {
  mounted = false;
  state = {
    loading: false,
    newOfficialModalOpen: false,
    editOfficeHolderModalOpen: false,
    newCommitteeTermModalOpen: false,
    address: '',
    addressResult: '',
    politicians: {},
    committees: {},
    error: '',
    politicianForNewCommitteeTerm: undefined,
    politicianForEdit: undefined,
    headerFilter: '',
  }

  componentDidMount() {
    this.mounted = true;
    http.get('/politicians', {
      authorization: 'bearer ' + auth.accessToken
    }).then(res => {
      const { politicians, committees } = this.getPoliticiansAndCommittees(res.politicians);
      this.setStateSafe({ politicians, committees, error: '' });
    }).catch(err => {
      this.setStateSafe({ error: 'error' });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setStateSafe(newState) {
    if (this.mounted) this.setState(newState);
  }

  // - don't need to worry about committees with a new politician because
  //   the new politician form doesn't have a way to add committees
  // - if we add the ability to add committees during politician creation
  //   then we'll have to update this method to also add the committees
  //   to the state
  addPolitician = (p) => {
    const { politicians } = this.state;
    politicians[p.id] = p;
    this.setStateSafe({ politicians });
  }

  updatePolitician = (p) => {
    const { politicians } = this.state;
    politicians[p.id] = p;
    this.setStateSafe({ politicians });
  }

  openEditOfficeHolderModal = (politicianForEdit) => {
    this.setStateSafe({
      editOfficeHolderModalOpen: true,
      politicianForEdit,
    });
  }

  closeEditOfficeHolderModal = (p) => {
    this.setStateSafe({
      editOfficeHolderModalOpen: false,
      politicianForEdit: undefined,
    });
  }

  editPolitician = (p) => {
    console.log('p', p);
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
    this.setStateSafe({ newOfficialModalOpen: true });
  }

  closeNewOfficialModal = () => {
    this.setStateSafe({ newOfficialModalOpen: false });
  }

  saveNewCommitteeTerm = (newCommitteeTerm) => {
    const { committees, politicianForNewCommitteeTerm } = this.state;
    const politicianId = politicianForNewCommitteeTerm.id;
    const committeesForPolitician = [ ...committees[politicianId], newCommitteeTerm ];

    this.setStateSafe({
      committees: { ...committees, [politicianId]: committeesForPolitician },
      politicianForNewCommitteeTerm: undefined,
      newCommitteeTermModalOpen: false,
    });
  }

  openNewCommitteeTermModal = (politicianForNewCommitteeTerm) => {
    this.setStateSafe({
      politicianForNewCommitteeTerm,
      newCommitteeTermModalOpen: true,
    });
  }

  closeNewCommitteeTermModal = () => {
    this.setStateSafe({
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
      if (res.status === 'err') this.setStateSafe({ addressResult: { wardNumber: 'not found' } });
      else this.setStateSafe({ addressResult: res.locationRes });
    });
  }

  updateAddress = ({ name, value }) => {
    this.setStateSafe({ address: value });
  }

  politicianIsFiltered(p, filter) {
    const fullName = `${p.firstName} ${p.middleName} ${p.lastName} ${p.suffix}`.toLowerCase();
    const politicalTitle = `${p.titlePrimary} ${p.levelOfResponsibility} ${p.areaOfResponsibility} ${p.party}`.toLowerCase();

    return (!fullName.includes(filter) && !politicalTitle.includes(filter));
  }

  renderPoliticians() {
    const { politicians, committees } = this.state;
    const headerFilter = this.state.headerFilter.toLowerCase();
    if (politicians.length < 1) return (<div>No Data</div>);

    return Object.keys(politicians).map(politicianId => {
      const p = politicians[politicianId];
      const c = committees[politicianId];

      if (headerFilter && this.politicianIsFiltered(p, headerFilter)) return;

      return (
        <PoliticianSummaryCard
          politician={p}
          committees={c}
          key={p.id}
          addCommitteeTerm={this.openNewCommitteeTermModal}
          editPolitician={() => { this.openEditOfficeHolderModal(p); }}
        />
      );
    });
  }

  changeHeaderFilter = ({ name, value }) => {
    this.setStateSafe({ [name]: value });
  }

  render() {
    const {
      address,
      data,
      newOfficialModalOpen,
      editOfficeHolderModalOpen,
      newCommitteeTermModalOpen,
      politicianForNewCommitteeTerm,
      headerFilter,
      politicianForEdit,
      addressResult
    } = this.state;

    return (
      <div className='home-page'>
        {
          newOfficialModalOpen && (
            <NewOfficialModal
              hideModal={this.closeNewOfficialModal}
              addPolitician={this.addPolitician}
            />
          )
        }
        {
          editOfficeHolderModalOpen && (
            <EditOfficeHolderModal
              hideModal={this.closeEditOfficeHolderModal}
              updatePolitician={this.updatePolitician}
              politician={politicianForEdit}
            />
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
// <section>
//   <div className='form-box' style={{ marginTop: '20px' }}>
//     <h2>
//       Search for an address
//     </h2>
//     <FormInput labelText='address' value={address} onChange={this.updateAddress} />
//     <button className='address-search-button' onClick={this.searchAddress}>
//       search
//     </button>
//     <div style={{ marginTop: '20px'}}>
//       Ward Number: { addressResult.wardNumber }
//     </div>
//   </div>
// </section>
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
