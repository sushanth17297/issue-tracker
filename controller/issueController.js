const { ObjectId } = require('mongodb');
const mongoDB = require('../database/config/mongodb')

function filterBy(filter, projectDetails) {
    //filter is applied i the project details based on Title/ Description/ Author.
    switch (filter) {
        case 'Title':
            for (let check = 0; check < projectDetails.length; ++check) {
                for (let index = 0; index < projectDetails.length - 1; ++index) {
                    let temp = null;
                    if (projectDetails[index].projectName > projectDetails[index + 1].projectName) {
                        temp = projectDetails[index];
                        projectDetails[index] = projectDetails[index + 1];
                        projectDetails[index + 1] = temp;
                    }
                }
            }
            return projectDetails;

        case 'Description':
            for (let check = 0; check < projectDetails.length; ++check) {
                for (let index = 0; index < projectDetails.length - 1; ++index) {
                    let temp = null;
                    if (projectDetails[index].description > projectDetails[index + 1].description) {
                        temp = projectDetails[index];
                        projectDetails[index] = projectDetails[index + 1];
                        projectDetails[index + 1] = temp;
                    }
                }
            }
            return projectDetails;

        case 'Author':
            for (let check = 0; check < projectDetails.length; ++check) {
                for (let index = 0; index < projectDetails.length - 1; ++index) {
                    let temp = null;
                    if (projectDetails[index].authorName > projectDetails[index + 1].authorName) {
                        temp = projectDetails[index];
                        projectDetails[index] = projectDetails[index + 1];
                        projectDetails[index + 1] = temp;
                    }
                }
            }
            return projectDetails;

        default:
            break;
    }

}

module.exports.issueTrackerPage = async (req, res) => {
    // this is called when the home page loaded.
    const collection = await mongoDB();
    const addedProject = await collection.find({ id: 'addedProject' }).toArray();
     // all the projects will loaded from DB
    return res.render('issueTracker', {
        // home page is rendered
        title: "Issue Tracker",
        addedProject
    })
}

module.exports.createProject = (req, res) => {
    //create project page is rendered
    return res.render('createProject', {
        title: "Create Project"
    })
}

module.exports.addProjectToMongoDB = async (req, res) => {
    //post request to create project is handled and will be added to the DB.
    let formData = req.body;
    formData = { ...formData, id: "addedProject" }
    const collection = await mongoDB();
    collection.insertOne(formData, (err, data) => {
        if (err)
            throw err
        else if (data)
            console.log('data inserted')
    });
    res.redirect('/issueTracker')
}

module.exports.projectDetails = async (req, res) => {
    //it ll get the all the project details and render the details page.
    const collection = await mongoDB();
    let projectDetails = await collection.find({ id: 'addedProject' }).toArray();
    return res.render('projectDetails', {
        title: "Project Details",
        projectDetails
    })
}

module.exports.filterProjectDetails = async (req, res) => {
    //filter is applied i the project details based on Title/ Description/ Author.
    const collection = await mongoDB();
    let projectDetails = await collection.find({ id: 'addedProject' }).toArray();
    const filterReq = req.body;

    if (filterReq.flexRadio === 'Project Title') {
        const filteredProjectDetails = filterBy('Title', projectDetails)
        return res.render('projectDetails', { title: "Project Details", projectDetails: filteredProjectDetails })
    }
    else if (filterReq.flexRadio === 'Project Description') {
        const filteredProjectDetails = filterBy('Description', projectDetails)
        return res.render('projectDetails', { title: "Project Details", projectDetails: filteredProjectDetails })
    }
    else if (filterReq.flexRadio === 'Project Author') {
        const filteredProjectDetails = filterBy('Author', projectDetails)
        return res.render('projectDetails', { title: "Project Details", projectDetails: filteredProjectDetails })
    }
}

module.exports.createAnIssue = async (req, res) => {
    //loads issue creating page
    const issueId = req.params;
    return res.render('createIssue', { title: "Create Issue", issueId })
}

module.exports.addAnIssue = async (req, res) => {
    //handles the post request from UI and stores the issue in the DB for the respective project.
    console.log(req.params);
    console.log(req.body);
    const issue = req.body;
    const bugId = req.params.id;
    const collection = await mongoDB();
    await collection.findOneAndUpdate({ _id: ObjectId(bugId) }, { '$push': { bugs: issue } });
    res.redirect('/issueTracker/projectDetails')
}