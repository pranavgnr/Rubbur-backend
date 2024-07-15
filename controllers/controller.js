const main = require('../models/mainModel');
const document = require('../models/documentModel');
const { get } = require('../routes/routes');
const mongoose = require('mongoose');

exports.getMainBookData = async (req,res) => {
    //const ids = getMainArrayIds();
    const maindoc = await main.findOne();
    const docIds = maindoc.documentIds;
    if (!docIds || docIds.length === 0) {
        res.status(200).json('there are no tiles to display');
    } else {
        try {
            const books = await document.find({ _id: { $in: docIds } });
            res.status(200).json(books);
        } catch(err) {
            res.status(400).json(err.message);
        }
    }
}

exports.postData = async (req,res) => {
    const p_id = req.body.parentId;
    if(!p_id || p_id.length==0){
        // res.status(400).json({"error":"Parent ID doesn't exist"});
        res.status(400).json('parent id not found');
    }

    const tile = new document({
        data: req.body.data,
        subBooks: [],
        parentId: p_id
    })
    try {
        await tile.save();
        res.status(200).json({"saved successfully ":tile});
        console.log(tile)

        if(p_id == '668d5646e97eb02181bc6a9f') {
            await main.findByIdAndUpdate(p_id,  
                { $push: { documentIds: tile._id } },
                { new: true })
        } else {
            await document.findByIdAndUpdate(p_id,
                { $push: { subBooks: tile._id } },
                { new: true });
        }
    } catch(err) {
        res.status(400).json(err.message);
    }
}

exports.backClickedData = async (req,res) => {
    const pid = req.body.parentId;
    arrayOfDataObjectIds = []
    try {
        const data = await document.find(pid);
        arrayOfDataObjectIds = data.subBooks;
    } catch (err) {
        console.log(err.message);
    }

    try {
        const dataArray = await document.find({_id: {$in: arrayOfDataObjectIds}});
        res.status(200).json(dataArray);
    } catch (err) {
        res.status(400).json(err.message);
    }
}

exports.deleteData = async (req,res) => {

    if(req.body.parentId == '668d5646e97eb02181bc6a9f') {
        try {
            await main.findByIdAndUpdate(req.body.parentId,  
                { $pull: { documentIds: req.body.tileId} },
                { new: true })
            // res.status(200).json('data updated');
        } catch(err) {
            //res.status(400).json(err.message);
            console.log('error while updating');
        }
        const idToBeDeleted = req.body.tileId;
        subBooksArray1 = []
        try {
            let tileData = await document.findById(idToBeDeleted);
            tileData = tileData.toObject();
            tileData.subBooks.forEach(ele => {
                subBooksArray1.push(ele.toJSON());
            });

            await document.findByIdAndDelete(idToBeDeleted);

            deleteFromSubBooks(subBooksArray1);
            
            res.status(200).json('deleted succesfully');
        } catch (err) {
            res.status(400).json(err.message);
        }
    } else {
        const idToBeDeleted = req.body.tileId;
        subBooksArray1 = []
        try {
            await document.findByIdAndUpdate(req.body.parentId,  
                { $pull: { subBooks: req.body.tileId} },
                { new: true })
            // res.status(200).json('data updated');
        } catch(err) {
            //res.status(400).json(err.message);
            console.log('error while updating');
        }
        try {
            let tileData = await document.findById(idToBeDeleted);
            tileData = tileData.toObject();
            tileData.subBooks.forEach(ele => {
                subBooksArray1.push(ele.toJSON());
            });

            await document.findByIdAndDelete(idToBeDeleted);

            deleteFromSubBooks(subBooksArray1);
            
            res.status(200).json('deleted succesfully');
        } catch (err) {
            res.status(400).json(err.message);
        }
    }
}

exports.viewBranchData = async (req,res) => {
    const tileId = req.body.tileId;
    subBooksArray = []
    try {
        let tileData = await document.findById(tileId);
        tileData = tileData.toObject();
        tileData.subBooks.forEach(ele => {
            subBooksArray.push(ele.toJSON());
        })
    } catch (err) {
        res.status(400).json('tile not found');
    }

    try {
        const objectIds = subBooksArray.map(id =>new mongoose.Types.ObjectId(id));
        const data = await document.find({ _id: { $in: objectIds } });
        res.status(200).json(data);
    } catch(err) {
        res.status(400).json({'error occured:': err.message});
    }
}

exports.updateData = async (req,res) => {
    const tileId = req.body.tileId;
    const data = req.body.data;
    try {
        //await document.findByIdAndUpdate(tileId,data,{ new: true });
        await document.findOneAndUpdate(
            { _id: tileId },  
            { $set: { data: data } }, 
            { returnNewDocument: true }  
          );
        res.status(200).json('data updated');
    } catch(err) {
        res.status(400).json(err.message);
    }
}

async function deleteFromSubBooks(subBooksArray) {
    if(subBooksArray.length > 0) {
        try {
            const objectIds = subBooksArray.map(id => id);
            const subAgain = await document.find({ _id: { $in: objectIds } });
            const data = await document.deleteMany({ _id: { $in: objectIds } });
            console.log(data);
            if(subAgain.length > 0) {
                let count = subAgain.length;
                let i = 0;
                let newSubBooks = []
                while(i < count) {
                    newSubBooks.push(subAgain[i].toObject().subBooks[i]);
                    i=i+1;
                }
                deleteFromSubBooks(newSubBooks);
            }  
        } catch(err) {
            console.log('error:', err.message);
        }
    }
}
