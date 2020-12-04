var userListData;
var perPage = 10;
var page = 1;
fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((json) => {
        if (json.length) {
            userListData = json;
            //----------------------Table--------------------------------//
            var table = document.createElement("TABLE");
            table.setAttribute("id", "userTable");

            var thead = document.createElement('thead');
            var tr = document.createElement('tr');

            var th = document.createElement('th');
            th.classList.add('select-check');
            var mainCheckBox = document.createElement('input');
            mainCheckBox.name = 'mainCheckBox';
            mainCheckBox.type = 'checkbox';
            th.appendChild(mainCheckBox);
            tr.appendChild(th);

            var th = document.createElement('th');
            th.appendChild(document.createTextNode("UserID"));
            tr.appendChild(th);

            var th = document.createElement('th');
            th.appendChild(document.createTextNode("Title"));
            tr.appendChild(th);

            var th = document.createElement('th');
            th.appendChild(document.createTextNode("Body"));
            tr.appendChild(th);

            thead.appendChild(tr);
            table.appendChild(thead);

            var tbody = loadTable();
            table.appendChild(tbody);
            document.body.appendChild(table);
            loadPagenation();
        }
    });

function loadTable() {
    var tbody = document.createElement('tbody');
    const uptoList = ((perPage * page) > userListData.length) ? userListData.length : perPage * page;
    for (i = ((perPage * page) - perPage); i < uptoList; i++) {
        const row = userListData[i];
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        var rowCheckBox = document.createElement('input');
        rowCheckBox.name = 'user-checkbox';
        rowCheckBox.type = 'checkbox';
        rowCheckBox.value = row.id;

        td.appendChild(rowCheckBox);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(row.userId));
        tr.appendChild(td);

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(row.title));
        tr.appendChild(td);

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(row.body));
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    const divs = document.querySelectorAll('#userTable tbody input');
    divs.forEach(el => el.addEventListener('click', checkForEdit));

    return tbody;
}

function loadPagenation() {
    var ol = document.createElement("OL");
    ol.setAttribute("id", "pageination-ol");

    var li = document.createElement("LI");
    li.setAttribute("id", "pre");
    li.classList.add('disabled');
    var pre = document.createTextNode("Pre");
    li.appendChild(pre);
    ol.appendChild(li);

    var li = document.createElement("LI");
    li.setAttribute("id", "next");
    var next = document.createTextNode("Next");
    li.appendChild(next);
    ol.appendChild(li);

    document.body.appendChild(ol);

    document.getElementById("pageination-ol").addEventListener("click", function (e) {
        if (e.target && e.target.nodeName == "LI") {
            if (e.target.id === 'next') {
                page++;
            } else {
                page--;
            }

            if (page === 1) {
                document.getElementById("pre").classList.add("disabled");
            } else {
                document.getElementById("pre").classList.remove("disabled");
                const totalNoOfPages = (userListData.length % perPage) ? parseInt(userListData.length / perPage) + 1 : userListData.length / perPage;
                if(totalNoOfPages === page){
                    document.getElementById("next").classList.add("disabled");
                }else{
                    if ( document.getElementById("next").classList.contains('disabled') ) {
                        document.getElementById("next").classList.remove("disabled");
                    }
                }
                
            }
            const tbody = document.querySelector("#userTable tbody");
            tbody.remove();

            const table = document.getElementById("userTable");
            var newtbody = loadTable();

            table.appendChild(newtbody);
        }
    });
}




function openUserForm() {
    cleanUserForm();
    var model = document.getElementById("myModel");
    model.style.display = "block";
}

function editUserForm() {
    var model = document.getElementById("myModel");

    var selectedUser = document.querySelectorAll('input[name=user-checkbox]:checked');
    const selectedUserID = selectedUser[0].value;

    fetch('https://jsonplaceholder.typicode.com/posts/' + selectedUserID)
        .then((response) => response.json())
        .then((json) => {
            cleanUserForm(json);
            model.style.display = "block";
        })
}

function cleanUserForm(json = false) {
    document.getElementsByName('form-userid')[0].value = (json) ? json.userId : '';
    document.getElementsByName('form-title')[0].value = (json) ? json.title : '';
    document.getElementsByName('form-body')[0].value = (json) ? json.body : '';
    document.getElementsByName('edit-id')[0].value = (json) ? json.id : 0;

}

function closeUserForm() {
    var model = document.getElementById("myModel");
    model.style.display = "none";
}

function saveUserForm() {
    let redirect = window.location.href;
    let userid = document.getElementsByName('form-userid')[0].value;
    let title = document.getElementsByName('form-title')[0].value;
    let body = document.getElementsByName('form-body')[0].value;
    let id = document.getElementsByName('edit-id')[0].value;

    var data = {
        title: title,
        body: body,
        userId: userid,
    };

    let method = 'POST';
    let url = 'https://jsonplaceholder.typicode.com/posts';
    if (parseInt(id)) {
        data.id = id;
        url += '/' + id;
        method = 'PUT';
    }

    fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => {
            window.location.href = redirect;
        });

    return false;
}

function checkForEdit() {
    let count = 0;
    const divs = document.querySelectorAll('#userTable tbody input');
    divs.forEach(el => {
        if (el.checked) {
            count++;
        }
    });
    let accessEditOption = true;
    if (count === 1) {
        accessEditOption = false;
    }
    let accessDeleteOption = true;
    if (count) {
        accessDeleteOption = false;
    }
    document.getElementById('editBtn').disabled = accessEditOption;
    document.getElementById('deleteBtn').disabled = accessDeleteOption;
}


function deleteUser() {
    let redirect = window.location.href;
    let count = 0;
    const divs = document.querySelectorAll('#userTable tbody input');
    divs.forEach(el => {
        if (el.checked) {
            count++;
            const selectedUserID = el.value;
            fetch('https://jsonplaceholder.typicode.com/posts/' + selectedUserID, {
                method: 'DELETE',
            })
        }
    });

    if (count) {
        window.location.href = redirect;
    }
}