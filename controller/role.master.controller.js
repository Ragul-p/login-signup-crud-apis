const Role = require("../model/role.model")


async function createRole(req, res) {

    try {
        const { role } = req.body;
        if (!role) { return res.status(200).json({ error: "required role" }) }

        const newRole = await Role.create({ role });

        return res.status(200).json({ newRole })
    } catch (error) {
        console.log(error);
    }


}


module.exports = { createRole }




