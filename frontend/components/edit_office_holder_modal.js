import React, { PureComponent } from 'react';
import FormInput from 'src/frontend/components/form_input';
import FormSelect, { FormSelectState } from 'src/frontend/components/form_select';
import http from 'src/frontend/services/http';
import OfficeHolderForm from 'src/frontend/components/office_holder_form';
import officeHolderModel from 'src/frontend/constants/office_holder_model';
import {
  validateDataSanity,
  validateInputs
} from 'src/frontend/services/form_validations/office_holder_form_validations';
import {
  generateValidationStateForForm,
  validateRequiredFields
} from 'src/frontend/services/form_validator';

function editOfficeHolderModalInitialState(politician) {
  const official = officeHolderModel(politician);
  const formValidationState = generateValidationStateForForm({ formFields: official });

  return {
    ...official,
    ...formValidationState,
  };
}

export default class EditOfficeHolderModal extends PureComponent {
  state = editOfficeHolderModalInitialState(this.props.politician);

  onSubmit = () => {
    this.setState({ formMessage: '' });
    const validationResult = this.validate();
    this.setState(validationResult);
    if (!validationResult.formValid) return;

    http.put('/politicians', officeHolderModel(this.state)).then(res => {
      this.setState({ formMessage: 'Successfully updated official' });
      this.props.updatePolitician(res.politician);
      // console.log(res);
    }).catch(err => {
      const errorMessage = err.message.length ? err.message : 'There was an error';
      this.setState({ formMessage: errorMessage });
      console.warn(err);
    });
  }

  validate() {
    const { requiredFields } = OfficeHolderForm;
    const { state } = this;

    return validateInputs({
      requiredFields,
      state,
      validateRequiredFields,
      validateDataSanity
    });
  }

  onChange = ({ name, value }) => {
    this.setState({ [name]: value })
  }

  render() {
    const { hideModal } = this.props;
    const {
      formMessage,
      firstName,
      firstNameMessage,
      middleName,
      middleNameMessage,
      lastName,
      lastNameMessage,
      suffix,
      suffixMessage,
      email,
      emailMessage,
      party,
      partyMessage,
      titlePrimary,
      titlePrimaryMessage,
      titleSecondary,
      titleSecondaryMessage,
      levelOfResponsibility,
      levelOfResponsibilityMessage,
      areaOfResponsibility,
      areaOfResponsibilityMessage,
      streetAddress,
      streetAddressMessage,
      city,
      cityMessage,
      state,
      stateMessage,
      zipCode,
      zipCodeMessage,
      phone,
      phoneMessage,
      missionStatement,
      missionStatementMessage
    } = this.state;

    return (
      <div>
        <div className='black-overlay' onClick={hideModal} />
        <div className='new-official-modal'>
          <OfficeHolderForm
            onSubmit={this.onSubmit}
            submitButtonLabel='Update'
            cancelForm={hideModal}
            title='Update Official'
            onChange={this.onChange}
            formMessage={formMessage}
            firstName={firstName}
            firstNameMessage={firstNameMessage}
            middleName={middleName}
            middleNameMessage={middleNameMessage}
            lastName={lastName}
            lastNameMessage={lastNameMessage}
            suffix={suffix}
            suffixMessage={suffixMessage}
            email={email}
            emailMessage={emailMessage}
            party={party}
            partyMessage={partyMessage}
            titlePrimary={titlePrimary}
            titlePrimaryMessage={titlePrimaryMessage}
            titleSecondary={titleSecondary}
            titleSecondaryMessage={titleSecondaryMessage}
            levelOfResponsibility={levelOfResponsibility}
            levelOfResponsibilityMessage={levelOfResponsibilityMessage}
            areaOfResponsibility={areaOfResponsibility}
            areaOfResponsibilityMessage={areaOfResponsibilityMessage}
            streetAddress={streetAddress}
            streetAddressMessage={streetAddressMessage}
            city={city}
            cityMessage={cityMessage}
            state={state}
            stateMessage={stateMessage}
            zipCode={zipCode}
            zipCodeMessage={zipCodeMessage}
            phone={phone}
            phoneMessage={phoneMessage}
            missionStatement={missionStatement}
            missionStatementMessage={missionStatementMessage}
          />
        </div>
      </div>
    )
  }
}