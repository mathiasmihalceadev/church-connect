import churchServices from '../services/churchService.js';

const postChurch = async (req, res) => {
    const {
        name,
        handle,
        denomination,
        address,
        country,
        city,
        region,
        postalCode,
        phoneNumber,
        email,
        website,
        congregation,
        history
    } = req.body;

    try {
        const churchId = await churchServices.registerChurch(name, handle, denomination, address, country, city, region, postalCode, phoneNumber, email, website, congregation, history);
        res.status(200).json({message: 'success', churchId: churchId});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const checkChurch = async (req, res) => {
    const {data, columnName} = req.body;

    try {
        const user = await churchServices.checkChurchBy(data, columnName);
        if (user) {
            res.status(201).json({exists: true});
        } else {
            res.status(201).json({exists: false});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const getChurchByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const church = await churchServices.getChurchData(userId);
        res.status(201).json({message: 'success', data: church});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export default {postChurch, checkChurch, getChurchByUserId};
