import React, { Component, PureComponent } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import NewOfficialModal from 'src/frontend/components/new_official_modal';
import EditOfficeHolderModal from 'src/frontend/components/edit_office_holder_modal';
import http from 'src/frontend/services/http';
import PoliticianSummaryCard from 'src/frontend/components/politician_summary_card';
import FormInput from 'src/frontend/components/form_input';
import auth from 'src/services/authorization';
import dataApiClient from 'src/frontend/clients/data_api/data_api_client';
import {
  generateValidationStateForForm,
  validateRequiredFields
} from 'src/frontend/services/form_validator';
import FormSelect from 'src/frontend/components/form_select';


export default class CandidatesPage extends PureComponent {
  render() {
    return (
      <div>
        candidates
      </div>
    );
  }
}
