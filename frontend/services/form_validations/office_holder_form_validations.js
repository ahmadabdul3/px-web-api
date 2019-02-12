export function validateInputs({
  requiredFields,
  state,
  validateRequiredFields,
  validateDataSanity
}) {
  let formValid = true;

  const requiredFieldsResult = validateRequiredFields({ requiredFields, state });
  if (!requiredFieldsResult.isValid) formValid = false;

  const { titlePrimary, levelOfResponsibility } = state;
  const dataSanityResult = validateDataSanity({ titlePrimary, levelOfResponsibility });
  if (!dataSanityResult.isValid) formValid = false;

  return {
    formValid,
    ...requiredFieldsResult.errors,
    ...dataSanityResult.errors
  };
}

export function validateDataSanity({
  titlePrimary,
  levelOfResponsibility
}) {
  let isValid = true;
  const errors = {};

  if (titlePrimary === 'Alder' && levelOfResponsibility !== 'District') {
    errors.formMessage = "An Alder's 'Level of Responsibility' should be 'District'";
    isValid = false;
  } else if (titlePrimary === 'Mayor' && levelOfResponsibility !== 'City') {
    errors.formMessage = "A Mayor's 'Level of Responsibility' should be 'City'";
    isValid = false;
  }

  return { errors, isValid };
}
