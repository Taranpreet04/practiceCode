import Vlog from "../model/vlog.js";

export const createVlog = async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnailUrl } = req.body;
        const vlog = new Vlog({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            userId: req.userId,
        });
        await vlog.save();
        res.status(201).json(vlog);
    } catch (error) {
        res.status(500).json({ message: "Failed to create vlog", error });
    }
}

export const getAllVlogs = async (req, res) => {
    try {
        const vlogs = await Vlog.find();
        res.status(200).json(vlogs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch vlogs", error });
    }
}

export const getVlogById = async (req, res) => {
    try {
        const vlog = await Vlog.findById(req.params.id);
        res.status(200).json(vlog);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch vlog", error });
    }
}

export const updateVlog = async (req, res) => {
    try {
        const vlog = await Vlog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(vlog);
    } catch (error) {
        res.status(500).json({ message: "Failed to update vlog", error });
    }
}

export const deleteVlog = async (req, res) => {
    try {
        const vlog = await Vlog.findByIdAndDelete(req.params.id);
        res.status(200).json(vlog);
    } catch (error) {
        res.status(500).json({ message: "Failed to delete vlog", error });
    }
}

export const likeVlog = async (req, res) => {
    try {
        const vlog = await Vlog.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.status(200).json(vlog);
    } catch (error) {
        res.status(500).json({ message: "Failed to like vlog", error });
    }
}

export const unlikeVlog = async (req, res) => {
    try {
        const vlog = await Vlog.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }, { new: true });
        res.status(200).json(vlog);
    } catch (error) {
        res.status(500).json({ message: "Failed to unlike vlog", error });
    }
}
