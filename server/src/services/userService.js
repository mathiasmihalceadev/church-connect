import userDataAccess from '../dataAccess/userDataAccess.js';

const getUserProfile = async (userId) => {
    const user = await userDataAccess.getUserById(userId);
    const roleName = await userDataAccess.getUserRoleName(user.user_role);
    const profilePictureUrl = user.profile_picture_id
        ? await userDataAccess.getProfilePictureUrl(userId)
        : null;
    // const groups = await userDataAccess.getUserGroups(userId);

    return {
        ...user,
        role: roleName,
        profilePictureUrl,
    };
};

const updateUser = async (userId, userData) => {
    const updatedUser = await userDataAccess.updateUser(userId, userData);
    const roleName = await userDataAccess.getUserRoleName(updatedUser.user_role);
    return {
        ...updatedUser,
        role: roleName,
    };
};

const createUser = async ({validation_code, first_name, last_name, groups, user_role, admin_id}) => {
    const roleId = await userDataAccess.getUserRoleIdByName(user_role);
    const groupIds = await userDataAccess.getGroupIdsByNames(groups);
    const churchId = await userDataAccess.getChurchIdByAdminId(admin_id);
    const newUser = await userDataAccess.createUser({
        validation_code,
        first_name,
        last_name,
        user_role: roleId,
        church_id: churchId,
        status: 'pending'
    });
    await userDataAccess.generateAndStoreQRCode(newUser.id, validation_code);
    await userDataAccess.addUserToGroups(newUser.id, groupIds);
    return newUser;
};

const getPendingUsers = async (adminId) => {
    const churchId = await userDataAccess.getChurchIdByAdminId(adminId);
    return await userDataAccess.getPendingUsers(churchId);
};

const getUserIdByValidationCode = async (code) => {
    return await userDataAccess.getUserIdByValidationCode(code);
};

const deleteUser = async (userId) => {
    await userDataAccess.deleteUser(userId);
};

const getAllUsersByChurchId = async (userId) => {
    const churchId = await userDataAccess.getChurchIdByAdminId(userId);
    return await userDataAccess.getAllUsersByChurchId(churchId);
};

const getUsersByChurchIdPaginated = async (userId, page, limit) => {
    const churchId = await userDataAccess.getChurchIdByAdminId(userId);
    const offset = (page - 1) * limit;
    return await userDataAccess.getUsersByChurchIdPaginated(churchId, offset, limit);
};

const getUsersByGroupId = async (groupId) => {
    return await userDataAccess.getUsersByGroupId(groupId);
};


export default {
    getUserProfile,
    updateUser,
    createUser,
    getPendingUsers,
    getUserIdByValidationCode,
    deleteUser,
    getAllUsersByChurchId,
    getUsersByChurchIdPaginated,
    getUsersByGroupId
};
