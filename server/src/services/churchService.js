import churchDataAccess from '../dataAccess/churchDataAccess.js';

const registerChurch = async (name, handle, denomination, address, country, city, region, postalCode, phoneNumber, email, website, congregation, history) => {
    const existingChurch = await churchDataAccess.getChurchBy(handle, 'church_handle');
    if (existingChurch) {
        throw new Error(`${handle} already exists`);
    }

    const churchId = await churchDataAccess.createChurch(name, handle, denomination, address, country, city, region, postalCode, phoneNumber, email, website, congregation, history);

    return churchId;
};

const checkChurchBy = async (data, columnName) => {
    const existingChurch = await churchDataAccess.getChurchBy(data, columnName);
    return !!existingChurch;
};

const getChurchData = async (userId) => {
    const church = await churchDataAccess.getChurchByUserId(userId);
    const churchId = church.id;
    const profilePictureUrl = church.church_profile_picture_id
        ? await churchDataAccess.getProfilePictureUrl(churchId)
        : null;

    return {
        ...church,
        profilePictureUrl,
    };
};

export default {registerChurch, checkChurchBy, getChurchData};
