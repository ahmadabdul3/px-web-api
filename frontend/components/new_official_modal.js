import React, { PureComponent } from 'react';
import FormInput from 'src/frontend/components/form_input';
import FormSelect, { FormSelectState } from 'src/frontend/components/form_select';
import http from 'src/frontend/services/http';
import {
  generateValidationStateForForm,
  validateRequiredFields
} from 'src/frontend/services/form_validator';

function officialModel(values={}) {
  return {
    firstName: values.firstName || '',
    middleName: values.middleName || '',
    lastName: values.lastName || '',
    suffix: values.suffix || '',
    email: values.email || '',
    party: values.party || '',
    titlePrimary: values.titlePrimary || '',
    titleSecondary: values.titleSecondary || '',
    levelOfResponsibility: values.levelOfResponsibility || '',
    areaOfResponsibility: values.areaOfResponsibility || '',
    streetAddress: values.streetAddress || '',
    city: values.city || '',
    state: values.state || '',
    zipCode: values.zipCode || '',
    phone: values.phone || '',
  };
}

function newOfficialModalInitialState() {
  const official = officialModel();
  const formValidationState = generateValidationStateForForm({ formFields: official });

  return {
    ...official,
    ...formValidationState,
  };
}

export default class NewOfficialModal extends PureComponent {
  static requiredFields = [
    'firstName',
    'lastName',
    'titlePrimary',
    'levelOfResponsibility',
    'areaOfResponsibility',
    'city',
    'state',
  ];
  state = newOfficialModalInitialState();

  onSubmit = (e) => {
    // console.log(this.state);
    e.preventDefault();
    this.setState({ formMessage: '' });
    try {
      this.validateInputs();
      http.post('/politicians', officialModel(this.state)).then(res => {
        this.setState({
          ...newOfficialModalInitialState(),
          formMessage: 'Successfully created new official',
        });
        console.log(res);
      }).catch(err => {
        const errorMessage = err.message || 'There was an error';
        this.setState({ formMessage: errorMessage });
        console.warn(err);
      });
    } catch (errors) {
      console.error(errors);
      this.setState({ ...errors });
    }
  }

  validateInputs() {
    let formValid = true;
    const { requiredFields } = NewOfficialModal;
    const { state } = this;

    const requiredFieldsResult = validateRequiredFields({ requiredFields, state });
    if (!requiredFieldsResult.isValid) formValid = false;

    const dataSanityResult = this.validateDataSanity();
    if (!dataSanityResult.isValid) formValid = false;

    if (!formValid) throw { ...requiredFieldsResult.errors, ...dataSanityResult.errors };
  }

  validateDataSanity() {
    let isValid = true;
    const errors = {};
    const { titlePrimary, levelOfResponsibility } = this.state;

    if (titlePrimary === 'alder' && levelOfResponsibility !== 'district') {
      errors.formMessage = "An Alder's 'Level of Responsibility' should be 'District'";
      isValid = false;
    } else if (titlePrimary === 'mayor' && levelOfResponsibility !== 'city') {
      errors.formMessage = "A Mayor's 'Level of Responsibility' should be 'City'";
      isValid = false;
    }

    return { errors, isValid };
  }

  onChange = ({ name, value }) => {
    this.setState({ [name]: value })
  }

  render() {
    const { hideModal } = this.props;

    return (
      <div>
        <div className='black-overlay' onClick={hideModal} />
        <div className='new-official-modal'>
          <form className='modal__form' onSubmit={this.onSubmit}>
            <div className='form-title'>
              Create a New Official
            </div>
            <div className='form-columns'>
              <div className='form-column'>
                <div className='form-column__title'>
                  Personal
                </div>
                <FormInput
                  labelText='First Name*'
                  onChange={this.onChange}
                  name='firstName'
                  value={this.state.firstName}
                  message={this.state.firstNameMessage}
                />
                <FormInput
                  labelText='Middle Name'
                  onChange={this.onChange}
                  name='middleName'
                  value={this.state.middleName}
                  message={this.state.middleNameMessage}
                />
                <FormInput
                  labelText='Last Name*'
                  onChange={this.onChange}
                  name='lastName'
                  value={this.state.lastName}
                  message={this.state.lastNameMessage}
                />
                <FormInput
                  labelText='Suffix'
                  onChange={this.onChange}
                  name='suffix'
                  value={this.state.suffix}
                  message={this.state.suffixMessage}
                />
                <FormInput
                  labelText='Email'
                  onChange={this.onChange}
                  name='email'
                  value={this.state.email}
                  message={this.state.emailMessage}
                />
              </div>
              <div className='form-column'>
                <div className='form-column__title'>
                  Political
                </div>
                <FormSelect
                  labelText='Party'
                  name='party'
                  value={this.state.party}
                  onChange={this.onChange}
                  message={this.state.partyMessage}
                  options={[
                    { value: 'Democrat', label: 'Democrat' },
                    { value: 'Republican', label: 'Republican' },
                  ]}
                />
                <FormSelect
                  labelText='Primary Title*'
                  name='titlePrimary'
                  value={this.state.titlePrimary}
                  onChange={this.onChange}
                  message={this.state.titlePrimaryMessage}
                  options={[
                    { value: 'Alder', label: 'Alder' },
                    { value: 'Mayor', label: 'Mayor' },
                  ]}
                />
                <FormInput
                  labelText='Secondary Title'
                  onChange={this.onChange}
                  name='titleSecondary'
                  value={this.state.titleSecondary}
                  message={this.state.titleSecondaryMessage}
                />
                <FormSelect
                  labelText='Level of Responsibility*'
                  name='levelOfResponsibility'
                  value={this.state.levelOfResponsibility}
                  onChange={this.onChange}
                  message={this.state.levelOfResponsibilityMessage}
                  options={[
                    { value: 'District', label: 'District' },
                    { value: 'City', label: 'City' },
                    { value: 'State', label: 'State' },
                  ]}
                />
                <FormSelect
                  labelText='Area of Responsibility*'
                  name='areaOfResponsibility'
                  value={this.state.areaOfResponsibility}
                  onChange={this.onChange}
                  message={this.state.areaOfResponsibilityMessage}
                  options={[
                    { value: 'New Haven', label: 'New Haven' },
                    { value: 'Connecticut', label: 'Connecticut' },
                  ]}
                />
              </div>
              <div className='form-column'>
                <div className='form-column__title'>
                  Contact
                </div>
                <FormInput
                  labelText='Phone Number'
                  onChange={this.onChange}
                  name='phone'
                  value={this.state.phone}
                  message={this.state.phoneMessage}
                />
                <FormInput
                  labelText='Address'
                  onChange={this.onChange}
                  name='streetAddress'
                  value={this.state.streetAddress}
                  message={this.state.streetAddressMessage}
                />
                <FormSelect
                  labelText='City*'
                  name='city'
                  value={this.state.city}
                  onChange={this.onChange}
                  message={this.state.cityMessage}
                  options={[ { value: 'New Haven', label: 'New Haven' } ]}
                />
                <FormSelectState
                  isRequired
                  name='state'
                  value={this.state.state}
                  onChange={this.onChange}
                  message={this.state.stateMessage}
                />
                <FormInput
                  labelText='Zip Code'
                  onChange={this.onChange}
                  name='zipCode'
                  value={this.state.zipCode}
                  message={this.state.zipCodeMessage}
                />
              </div>
            </div>
            <div className='form-messages'>
              { this.state.formMessage }
            </div>
            <div className='form-buttons'>
              <button type='button' className='button' onClick={hideModal}>
                Cancel
              </button>
              <button className='green-button'>
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
