export default function officeHolderModel(values={}) {
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
    missionStatement: values.missionStatement || '',
  };
}
