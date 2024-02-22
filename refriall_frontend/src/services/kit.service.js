import apiBase from "./base.service";

const urlKit ='/stock/kits';

export const listKit = async (currentPage) => {
    try {
        return await apiBase.get(`${urlKit}/?page=${currentPage}`);
    } catch (error) {
        console.log(error);
    }
};

export const detatilKit = async (id) => {
    try {
        return await apiBase.get(`${urlKit}/${id}/`);
    } catch (error) {
        console.log();
    }
}

export const postKit = async (kit) => {
    try {
        return await apiBase.post(`${urlKit}/`, kit);
    } catch (error) {
        console.log();
    }
};

export const putKit = async (kit) => {
    try {
        return await apiBase.put(`${urlKit}/${kit.id}/`, kit);
    } catch (error) {
        console.log();
    }
};

export const deleteKit = async (id) => {
    try {
        await apiBase.delete(`${urlKit}/${id}/`);
    } catch (error) {
        console.log();
    }
};