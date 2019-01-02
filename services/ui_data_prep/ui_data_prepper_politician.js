import { invalidUiKeysShared } from './ui_data_prepper_shared';

export default function prepModelForUi(model) {
  return Object.keys(model).reduce((preppedModel, key) => {
    if (keyIsValidForUi(key)) preppedModel[key] = model[key];
    return preppedModel;
  }, {});
}

const invalidUiKeys = {
  ...invalidUiKeysShared,
  politicianId: true,
  officeHolderTerms: true,
  contactInfos: true,
};

function keyIsValidForUi(key) { return !invalidUiKeys[key]; }
