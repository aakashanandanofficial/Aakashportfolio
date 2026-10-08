/* =========================================================
   AAKASH PORTFOLIO
   COMPLETE JAVASCRIPT
   SUPABASE + ADMIN LOGIN + PROJECTS
========================================================= */


/* =========================================================
   1. SUPABASE CONNECTION
========================================================= */

const SUPABASE_URL =
    "https://jcvekbddponseenflbjc.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ySTjG7z4bP5xWg_b7jmT9w_GF-iLIEG";


let supabaseClient = null;


/* =========================================================
   2. GLOBAL VARIABLES
========================================================= */

let currentUser = null;
let projects = [];

let navButtons = [];
let sections = [];

let projectsSection = null;
let projectsContainer = null;
let addProjectButton = null;
let noProjects = null;

let projectModal = null;
let projectForm = null;
let closeModal = null;

let loginModal = null;
let loginForm = null;
let closeLoginModal = null;
let adminButton = null;


/* =========================================================
   3. LOAD SUPABASE LIBRARY
========================================================= */

function loadSupabaseLibrary() {

    return new Promise(function(resolve, reject) {

        if (window.supabase) {
            resolve();
            return;
        }

        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = function() {
            resolve();
        };

        script.onerror = function() {
            reject(
                new Error(
                    "Could not load Supabase JavaScript library."
                )
            );
        };

        document.head.appendChild(script);

    });

}


/* =========================================================
   4. CREATE SUPABASE CONNECTION
========================================================= */

async function initializeSupabase() {

    try {

        await loadSupabaseLibrary();


        /*
           Remove /rest/v1/ if accidentally pasted.
        */

        const cleanSupabaseURL =
            SUPABASE_URL
                .replace(/\/rest\/v1\/?$/, "")
                .replace(/\/$/, "");


        if (
            !cleanSupabaseURL ||
            !SUPABASE_PUBLISHABLE_KEY
        ) {

            throw new Error(
                "Supabase URL or Publishable Key is missing."
            );

        }


        supabaseClient =
            window.supabase.createClient(
                cleanSupabaseURL,
                SUPABASE_PUBLISHABLE_KEY
            );


        console.log(
            "Supabase connected successfully."
        );


        return true;

    } catch (error) {

        console.error(
            "Supabase connection error:",
            error
        );

        alert(
            "Supabase could not be connected.\n\n" +
            error.message
        );

        return false;

    }

}


/* =========================================================
   5. NAVIGATION
========================================================= */

function setupNavigation() {

    navButtons =
        document.querySelectorAll(
            ".nav-button"
        );

    sections =
        document.querySelectorAll(
            ".page-section"
        );


    navButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                const sectionId =
                    button.dataset.section;

                if (sectionId) {

                    showSection(sectionId);

                }

            }
        );

    });

}


function showSection(sectionId) {

    sections.forEach(function(section) {

        section.classList.remove(
            "active-section"
        );

    });


    const selectedSection =
        document.getElementById(
            sectionId
        );


    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    navButtons.forEach(function(button) {

        button.classList.remove(
            "active"
        );


        if (
            button.dataset.section ===
            sectionId
        ) {

            button.classList.add(
                "active"
            );

        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   6. HOME BUTTONS
========================================================= */

function setupHomeButtons() {

    const aboutButton =
        document.getElementById(
            "aboutButton"
        );

    const projectButton =
        document.getElementById(
            "projectButton"
        );


    if (aboutButton) {

        aboutButton.addEventListener(
            "click",
            function() {

                showSection("about");

            }
        );

    }


    if (projectButton) {

        projectButton.addEventListener(
            "click",
            function() {

                showSection("projects");

            }
        );

    }

}


/* =========================================================
   7. PROJECT SECTION
========================================================= */

function setupProjectSection() {

    projectsSection =
        document.getElementById(
            "projects"
        );


    if (!projectsSection) {

        console.warn(
            "Projects section not found."
        );

        return;

    }


    projectsContainer =
        document.getElementById(
            "projectsContainer"
        );


    if (!projectsContainer) {

        projectsContainer =
            document.createElement(
                "div"
            );

        projectsContainer.id =
            "projectsContainer";

        projectsContainer.className =
            "projects-grid";


        projectsSection.appendChild(
            projectsContainer
        );

    }


    createAddProjectButton();

    createNoProjectsMessage();

    createProjectModal();

}


/* =========================================================
   8. ADD PROJECT BUTTON
========================================================= */

function createAddProjectButton() {

    addProjectButton =
        document.getElementById(
            "addProjectButton"
        );


    if (!addProjectButton) {

        addProjectButton =
            document.createElement(
                "button"
            );

        addProjectButton.id =
            "addProjectButton";

        addProjectButton.type =
            "button";

        addProjectButton.className =
            "add-project-button";

        addProjectButton.textContent =
            "🔐 Add Project";


        projectsSection.prepend(
            addProjectButton
        );

    }


    addProjectButton.addEventListener(
        "click",
        function() {

            if (!currentUser) {

                alert(
                    "Please login as Admin first."
                );

                openLoginModal();

                return;

            }


            if (projectModal) {

                projectModal.classList.add(
                    "show"
                );

            }


            const nameInput =
                document.getElementById(
                    "projectName"
                );


            if (nameInput) {

                setTimeout(
                    function() {

                        nameInput.focus();

                    },
                    100
                );

            }

        }
    );

}


/* =========================================================
   9. NO PROJECTS MESSAGE
========================================================= */

function createNoProjectsMessage() {

    noProjects =
        document.getElementById(
            "noProjects"
        );


    if (!noProjects) {

        noProjects =
            document.createElement(
                "p"
            );

        noProjects.id =
            "noProjects";

        noProjects.className =
            "no-projects";

        noProjects.textContent =
            "No projects added yet.";

    }

}


/* =========================================================
   10. PROJECT MODAL
========================================================= */

function createProjectModal() {

    projectModal =
        document.getElementById(
            "projectModal"
        );


    if (!projectModal) {

        projectModal =
            document.createElement(
                "div"
            );

        projectModal.id =
            "projectModal";

        projectModal.className =
            "modal";


        projectModal.innerHTML = `

            <div class="modal-content">

                <button
                    type="button"
                    id="closeModal"
                    class="close-modal"
                >
                    ×
                </button>

                <h2>Add New Project</h2>

                <form id="projectForm">

                    <label>
                        Project Name
                    </label>

                    <input
                        type="text"
                        id="projectName"
                        placeholder="Enter project name"
                        required
                    >


                    <label>
                        Project Description
                    </label>

                    <textarea
                        id="projectDescription"
                        placeholder="Enter project description"
                        required
                    ></textarea>


                    <label>
                        Live Website URL
                    </label>

                    <input
                        type="url"
                        id="projectUrl"
                        placeholder="https://example.com"
                        required
                    >


                    <button
                        type="submit"
                        class="submit-project"
                    >
                        Save Project
                    </button>

                </form>

            </div>

        `;


        document.body.appendChild(
            projectModal
        );

    }


    projectForm =
        document.getElementById(
            "projectForm"
        );

    closeModal =
        document.getElementById(
            "closeModal"
        );


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            function() {

                projectModal.classList.remove(
                    "show"
                );

            }
        );

    }


    if (projectModal) {

        projectModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    projectModal
                ) {

                    projectModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    if (projectForm) {

        projectForm.addEventListener(
            "submit",
            saveProject
        );

    }

}


/* =========================================================
   11. SAVE PROJECT
========================================================= */

async function saveProject(event) {

    event.preventDefault();


    if (!currentUser) {

        alert(
            "Please login as Admin first."
        );

        return;

    }


    if (!supabaseClient) {

        alert(
            "Supabase is not connected."
        );

        return;

    }


    const name =
        document
            .getElementById(
                "projectName"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "projectDescription"
            )
            .value
            .trim();


    let url =
        document
            .getElementById(
                "projectUrl"
            )
            .value
            .trim();


    if (
        !name ||
        !description ||
        !url
    ) {

        alert(
            "Please fill all fields."
        );

        return;

    }


    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        url =
            "https://" + url;

    }


    try {

        const result =
            await supabaseClient
                .from("projects")
                .insert({

                    name: name,

                    description:
                        description,

                    url: url,

                    owner_id:
                        currentUser.id

                });


        if (result.error) {

            console.error(
                result.error
            );

            alert(
                "Project could not be saved.\n\n" +
                result.error.message
            );

            return;

        }


        projectForm.reset();


        projectModal.classList.remove(
            "show"
        );


        alert(
            "Project added successfully!"
        );


        await loadProjects();


        showSection(
            "projects"
        );

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Project could not be saved.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   12. LOAD PROJECTS
========================================================= */

async function loadProjects() {

    if (!supabaseClient) {

        console.error(
            "Supabase is not connected."
        );

        return;

    }


    if (!projectsContainer) {

        return;

    }


    try {

        const result =
            await supabaseClient
                .from("projects")
                .select(
                    "id, name, description, url, owner_id, created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (result.error) {

            console.error(
                "Could not load projects:",
                result.error
            );

            return;

        }


        projects =
            result.data || [];


        displayProjects();

    } catch (error) {

        console.error(
            "Project loading error:",
            error
        );

    }

}


/* =========================================================
   13. DISPLAY PROJECTS
========================================================= */

function displayProjects() {

    if (!projectsContainer) {

        return;

    }


    projectsContainer.innerHTML =
        "";


    if (projects.length === 0) {

        if (noProjects) {

            noProjects.style.display =
                "block";


            projectsContainer.appendChild(
                noProjects
            );

        }

        return;

    }


    if (noProjects) {

        noProjects.style.display =
            "none";

    }


    projects.forEach(
        function(project, index) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "project-card";


            let deleteButton =
                "";


            if (
                currentUser &&
                project.owner_id ===
                currentUser.id
            ) {

                deleteButton = `

                    <button
                        type="button"
                        class="delete-project"
                        data-id="${escapeAttribute(
                            project.id
                        )}"
                    >
                        Delete
                    </button>

                `;

            }


            card.innerHTML = `

                <div class="project-number">
                    PROJECT
                    ${String(
                        index + 1
                    ).padStart(2, "0")}
                </div>

                <h3>
                    ${escapeHTML(
                        project.name
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        project.description
                    )}
                </p>

                <div class="project-actions">

                    <a
                        href="${escapeAttribute(
                            project.url
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-link"
                    >
                        Open Project ↗
                    </a>

                    ${deleteButton}

                </div>

            `;


            projectsContainer.appendChild(
                card
            );

        }
    );


    setupDeleteButtons();

}


/* =========================================================
   14. DELETE BUTTONS
========================================================= */

function setupDeleteButtons() {

    const buttons =
        document.querySelectorAll(
            ".delete-project"
        );


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                async function() {

                    const id =
                        button.dataset.id;


                    const project =
                        projects.find(
                            function(item) {

                                return String(
                                    item.id
                                ) ===
                                String(id);

                            }
                        );


                    if (!project) {

                        return;

                    }


                    const confirmed =
                        confirm(
                            'Do you want to delete "' +
                            project.name +
                            '"?'
                        );


                    if (!confirmed) {

                        return;

                    }


                    await deleteProject(
                        id
                    );

                }
            );

        }
    );

}


/* =========================================================
   15. DELETE PROJECT
========================================================= */

async function deleteProject(
    projectId
) {

    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;

    }


    if (!supabaseClient) {

        alert(
            "Supabase is not connected."
        );

        return;

    }


    try {

        const result =
            await supabaseClient
                .from("projects")
                .delete()
                .eq(
                    "id",
                    projectId
                );


        if (result.error) {

            console.error(
                result.error
            );

            alert(
                "Project could not be deleted.\n\n" +
                result.error.message
            );

            return;

        }


        await loadProjects();

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Project could not be deleted.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   16. LOGIN MODAL
========================================================= */

function createLoginModal() {

    loginModal =
        document.getElementById(
            "loginModal"
        );


    if (!loginModal) {

        loginModal =
            document.createElement(
                "div"
            );

        loginModal.id =
            "loginModal";

        loginModal.className =
            "modal";


        loginModal.innerHTML = `

            <div class="modal-content">

                <button
                    type="button"
                    id="closeLoginModal"
                    class="close-modal"
                >
                    ×
                </button>

                <h2>Admin Login</h2>

                <form id="loginForm">

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        id="loginEmail"
                        placeholder="Admin email"
                        required
                    >

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        id="loginPassword"
                        placeholder="Password"
                        required
                    >

                    <button
                        type="submit"
                        class="submit-project"
                    >
                        Login
                    </button>

                </form>

            </div>

        `;


        document.body.appendChild(
            loginModal
        );

    }


    adminButton =
        document.getElementById(
            "adminButton"
        );


    loginForm =
        document.getElementById(
            "loginForm"
        );


    closeLoginModal =
        document.getElementById(
            "closeLoginModal"
        );


    if (closeLoginModal) {

        closeLoginModal.addEventListener(
            "click",
            function() {

                loginModal.classList.remove(
                    "show"
                );

            }
        );

    }


    if (loginModal) {

        loginModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    loginModal
                ) {

                    loginModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            loginAdmin
        );

    }


    if (adminButton) {

        adminButton.addEventListener(
            "click",
            async function() {

                if (currentUser) {

                    const answer =
                        confirm(
                            "Do you want to logout?"
                        );


                    if (answer) {

                        await logoutAdmin();

                    }

                } else {

                    openLoginModal();

                }

            }
        );

    }

}


/* =========================================================
   17. OPEN LOGIN
========================================================= */

function openLoginModal() {

    if (!loginModal) {

        return;

    }


    loginModal.classList.add(
        "show"
    );


    const emailInput =
        document.getElementById(
            "loginEmail"
        );


    if (emailInput) {

        setTimeout(
            function() {

                emailInput.focus();

            },
            100
        );

    }

}


/* =========================================================
   18. ADMIN LOGIN
========================================================= */

async function loginAdmin(event) {

    event.preventDefault();


    if (!supabaseClient) {

        alert(
            "Supabase is not connected."
        );

        return;

    }


    const email =
        document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    if (!email || !password) {

        alert(
            "Please enter your email and password."
        );

        return;

    }


    try {

        const result =
            await supabaseClient.auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });


        if (result.error) {

            console.error(
                "Login error:",
                result.error
            );


            alert(
                "Login failed.\n\n" +
                result.error.message
            );

            return;

        }


        currentUser =
            result.data.user;


        if (loginModal) {

            loginModal.classList.remove(
                "show"
            );

        }


        loginForm.reset();


        updateAdminUI();


        await loadProjects();


        alert(
            "Admin login successful!"
        );

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Login failed.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   19. CHECK CURRENT LOGIN
========================================================= */

async function checkLogin() {

    if (!supabaseClient) {

        currentUser = null;

        updateAdminUI();

        return;

    }


    try {

        const result =
            await supabaseClient.auth
                .getUser();


        if (
            result.data &&
            result.data.user
        ) {

            currentUser =
                result.data.user;

        } else {

            currentUser = null;

        }


        updateAdminUI();

    } catch (error) {

        console.error(
            "Login check error:",
            error
        );

        currentUser = null;

        updateAdminUI();

    }

}


/* =========================================================
   20. AUTH STATE
========================================================= */

function setupAuthListener() {

    if (!supabaseClient) {

        return;

    }


    supabaseClient.auth.onAuthStateChange(
        function(event, session) {

            if (
                session &&
                session.user
            ) {

                currentUser =
                    session.user;

            } else {

                currentUser = null;

            }


            updateAdminUI();


            /*
               Do not load projects too aggressively
               during auth events.
            */

            setTimeout(
                function() {

                    loadProjects();

                },
                0
            );

        }
    );

}


/* =========================================================
   21. UPDATE ADMIN UI
========================================================= */

function updateAdminUI() {

    if (currentUser) {

        document.body.classList.add(
            "admin-logged-in"
        );


        if (addProjectButton) {

            addProjectButton.style.display =
                "inline-flex";

            addProjectButton.textContent =
                "+ Add Project";

        }


        if (adminButton) {

            adminButton.innerHTML =
                "🔓 Admin";

        }

    } else {

        document.body.classList.remove(
            "admin-logged-in"
        );


        if (addProjectButton) {

            addProjectButton.style.display =
                "inline-flex";

            addProjectButton.textContent =
                "🔐 Add Project";

        }


        if (adminButton) {

            adminButton.innerHTML =
                "🔐 Admin";

        }

    }


    displayProjects();

}


/* =========================================================
   22. LOGOUT
========================================================= */

async function logoutAdmin() {

    if (!supabaseClient) {

        return;

    }


    try {

        const result =
            await supabaseClient.auth
                .signOut();


        if (result.error) {

            alert(
                "Logout failed.\n\n" +
                result.error.message
            );

            return;

        }


        currentUser = null;


        updateAdminUI();


        await loadProjects();


        alert(
            "Logged out successfully."
        );

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Logout failed.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   23. SECURITY HELPERS
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        );

}


/* =========================================================
   24. START WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "Portfolio JavaScript started."
        );


        /*
           Navigation
        */

        setupNavigation();


        /*
           Home buttons
        */

        setupHomeButtons();


        /*
           Project section
        */

        setupProjectSection();


        /*
           Login
        */

        createLoginModal();


        /*
           Show Home first
        */

        showSection("home");


        /*
           Connect Supabase
        */

        const connected =
            await initializeSupabase();


        if (!connected) {

            console.error(
                "Website started without Supabase."
            );

            return;

        }


        /*
           Listen for login/logout
        */

        setupAuthListener();


        /*
           Check existing login
        */

        await checkLogin();


        /*
           Load projects
        */

        await loadProjects();


        console.log(
            "Portfolio website ready."
        );

    }
);