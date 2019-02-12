import React, { PureComponent } from 'react';
import FormInput from 'src/frontend/components/form_input';
import FormTextarea from 'src/frontend/components/form_textarea';
import FormSelect, { FormSelectState } from 'src/frontend/components/form_select';

export default class OfficeHolderForm extends PureComponent {
  static requiredFields = [
    'firstName',
    'lastName',
    'titlePrimary',
    'levelOfResponsibility',
    'areaOfResponsibility',
    'city',
    'state',
  ];

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
    const {
      cancelForm,
      submitButtonLabel,
      title,
      onChange,
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
    } = this.props;

    return (
      <form className='modal__form' onSubmit={this.onSubmit}>
        <div className='form-title'>
          { title }
        </div>
        <div className='form-columns'>
          <div className='form-column'>
            <div className='form-column__title'>
              Personal
            </div>
            <FormInput
              labelText='First Name*'
              onChange={onChange}
              name='firstName'
              value={firstName}
              message={firstNameMessage}
            />
            <FormInput
              labelText='Middle Name'
              onChange={onChange}
              name='middleName'
              value={middleName}
              message={middleNameMessage}
            />
            <FormInput
              labelText='Last Name*'
              onChange={onChange}
              name='lastName'
              value={lastName}
              message={lastNameMessage}
            />
            <FormInput
              labelText='Suffix'
              onChange={onChange}
              name='suffix'
              value={suffix}
              message={suffixMessage}
            />
            <FormInput
              labelText='Email'
              onChange={onChange}
              name='email'
              value={email}
              message={emailMessage}
            />
          </div>
          <div className='form-column'>
            <div className='form-column__title'>
              Political
            </div>
            <FormSelect
              labelText='Party'
              name='party'
              value={party}
              onChange={onChange}
              message={partyMessage}
              options={[
                { value: 'Democrat', label: 'Democrat' },
                { value: 'Republican', label: 'Republican' },
              ]}
            />
            <FormSelect
              labelText='Primary Title*'
              name='titlePrimary'
              value={titlePrimary}
              onChange={onChange}
              message={titlePrimaryMessage}
              options={[
                { value: 'Alder', label: 'Alder' },
                { value: 'Mayor', label: 'Mayor' },
              ]}
            />
            <FormInput
              labelText='Secondary Title'
              onChange={onChange}
              name='titleSecondary'
              value={titleSecondary}
              message={titleSecondaryMessage}
            />
            <FormSelect
              labelText='Level of Responsibility*'
              name='levelOfResponsibility'
              value={levelOfResponsibility}
              onChange={onChange}
              message={levelOfResponsibilityMessage}
              options={[
                { value: 'District', label: 'District' },
                { value: 'City', label: 'City' },
                { value: 'State', label: 'State' },
              ]}
            />
            {
              submitButtonLabel === 'Update' ? (
                <FormInput
                  labelText='Area of Responsibility'
                  onChange={onChange}
                  name='areaOfResponsibility'
                  value={areaOfResponsibility}
                  message={areaOfResponsibilityMessage}
                />
              ) : (
                <FormSelect
                  labelText='Area of Responsibility*'
                  name='areaOfResponsibility'
                  value={areaOfResponsibility}
                  onChange={onChange}
                  message={areaOfResponsibilityMessage}
                  options={[
                    { value: 'New Haven', label: 'New Haven' },
                    { value: 'Connecticut', label: 'Connecticut' },
                  ]}
                />
              )
            }
          </div>
          <div className='form-column'>
            <div className='form-column__title'>
              Contact
            </div>
            <FormInput
              labelText='Phone Number'
              onChange={onChange}
              name='phone'
              value={phone}
              message={phoneMessage}
            />
            <FormInput
              labelText='Address'
              onChange={onChange}
              name='streetAddress'
              value={streetAddress}
              message={streetAddressMessage}
            />
            <FormSelect
              labelText='City*'
              name='city'
              value={city}
              onChange={onChange}
              message={cityMessage}
              options={[ { value: 'New Haven', label: 'New Haven' } ]}
            />
            <FormSelectState
              isRequired
              name='state'
              value={state}
              onChange={onChange}
              message={stateMessage}
            />
            <FormInput
              labelText='Zip Code'
              onChange={onChange}
              name='zipCode'
              value={zipCode}
              message={zipCodeMessage}
            />
          </div>
        </div>
        <div className='mission-statement'>
          <div className='form-column__title'>
            Mission Statement - num chars { missionStatement.length }
          </div>
          <FormTextarea
            labelText=''
            onChange={onChange}
            name='missionStatement'
            value={missionStatement}
            message={missionStatementMessage}
          />
        </div>
        {
          formMessage && (
            <div className='form-messages'>
              { formMessage }
            </div>
          )
        }
        <div className='form-buttons'>
          <button type='button' className='button' onClick={cancelForm}>
            Cancel
          </button>
          <button className='green-button'>
            { submitButtonLabel || 'Submit' }
          </button>
        </div>
      </form>
    );
  }
}
