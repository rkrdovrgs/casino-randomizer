export default [
    //public
    {
        route: "",
        moduleId: "home",
        title: "Songs",
        auth: false,
        name: "home",
        elementId: "home"
    },
    {
        route: "dance-along/:songId",
        moduleId: "dance-along/dance-along",
        title: "Dance Along",
        auth: false,
        name: "dance-along",
        elementId: "dance-along"
    },

    //admin
    {
        route: "admin/songs",
        moduleId: "admin/songs/songs",
        title: "Songs",
        auth: false,
        name: "admin-songs",
        elementId: "admin-songs"
    },
    {
        route: "admin/songs/add",
        moduleId: "admin/songs/song-details",
        title: "Song Details",
        auth: false,
        name: "admin-song-create",
        elementId: "admin-song-details"
    },
    {
        route: "admin/songs/:songId",
        moduleId: "admin/songs/song-details",
        title: "Song Details",
        auth: false,
        name: "admin-song-details",
        elementId: "admin-song-create"
    },
    {
        route: "admin/figures",
        moduleId: "admin/figures/figures",
        title: "Figures",
        elementId: "admin-figures",
        name: "admin-figures",
        auth: false
    }
] as Array<IRoute>;