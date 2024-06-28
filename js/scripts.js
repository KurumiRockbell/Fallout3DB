$(document).ready(function() {
    let allWeapons = [];
    let currentPage = 1;
    const itemsPerPage = 5;

    function displayWeapons(weapons) {
        let weaponsList = $('#weaponsList');
        weaponsList.empty();
        weapons.forEach(function(weapon) {
            weaponsList.append(
                `<div class="card bg-secondary text-white mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${weapon.name}</h5>
                        <p class="card-text">${weapon.description}</p>
                        <p class="card-text"><strong>Ammo:</strong> ${weapon.ammo}</p>
                        <p class="card-text"><strong>Category:</strong> ${weapon.category}</p>
                        <p class="card-text"><strong>Damage:</strong> ${weapon.damage}</p>
                        <p class="card-text"><strong>Weight:</strong> ${weapon.weight}</p>
                        <p class="card-text"><strong>Value:</strong> ${weapon.value}</p>
                        <button class="btn btn-info btn-sm" onclick="showWeaponDetails('${weapon.name}', '${weapon.description}', '${weapon.ammo}', '${weapon.category}', '${weapon.image}', '${weapon.damage}', '${weapon.weight}', '${weapon.value}', '${weapon.power}')">Details</button>
                    </div>
                </div>`
            );
        });
    }

    function paginate(array, page_number) {
        return array.slice((page_number - 1) * itemsPerPage, page_number * itemsPerPage);
    }

    function displayPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        $('#pagination').empty();
        for (let i = 1; i <= totalPages; i++) {
            $('#pagination').append(
                `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>`
            );
        }
    }

    function changePage(page) {
        currentPage = page;
        const paginatedWeapons = paginate(allWeapons, currentPage);
        displayWeapons(paginatedWeapons);
        displayPagination(allWeapons.length);
    }

    function sortWeapons(criteria) {
        allWeapons.sort((a, b) => {
            if (a[criteria] < b[criteria]) return -1;
            if (a[criteria] > b[criteria]) return 1;
            return 0;
        });
        changePage(1);
    }

    $('#loadWeapons').click(function() {
        $.ajax({
            url: 'weapons.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                allWeapons = data.weapons;
                localStorage.setItem('weapons', JSON.stringify(allWeapons));
                changePage(1);
            },
            error: function() {
                $('#weaponsList').html('<div class="alert alert-danger" role="alert">Error loading weapons data.</div>');
            }
        });
    });

    $('#searchBox').on('input', function() {
        let searchTerm = $(this).val().toLowerCase();
        let filteredWeapons = allWeapons.filter(function(weapon) {
            return weapon.name.toLowerCase().includes(searchTerm) ||
                   weapon.category.toLowerCase().includes(searchTerm);
        });
        currentPage = 1;
        displayWeapons(paginate(filteredWeapons, currentPage));
        displayPagination(filteredWeapons.length);
    });

    $('#sortOptions').change(function() {
        const criteria = $(this).val();
        sortWeapons(criteria);
    });

    $('#pagination').on('click', '.page-link', function(event) {
        event.preventDefault();
        const page = $(this).data('page');
        changePage(page);
    });

    // Load weapons from localStorage if available
    if (localStorage.getItem('weapons')) {
        allWeapons = JSON.parse(localStorage.getItem('weapons'));
        changePage(1);
    }

    // Initialize tooltips
    $(document).on('mouseover', '[data-bs-toggle="tooltip"]', function() {
        const tooltip = new bootstrap.Tooltip(this);
        tooltip.show();
    });
});

function showWeaponDetails(name, description, ammo, category, image, damage, weight, value, power) {
    $('#modalWeaponName').html(`${name} ${generateCapsHtml(power)}`);
    $('#modalWeaponDescription').text(description);
    $('#modalWeaponAmmo').text(ammo);
    $('#modalWeaponCategory').text(category);
    $('#modalWeaponImage').attr('src', image);
    $('#modalWeaponDamage').text(damage);
    $('#modalWeaponWeight').text(weight);
    $('#modalWeaponValue').text(value);

    $('#weaponModal').modal('show');
}

function generateCapsHtml(power) {
    let powerHtml = '';
    for (let i = 0; i < power; i++) {
        powerHtml += `<img src="./images/caps.webp" alt="Caps" style="width: 20px; height: 20px; margin-right: 2px;" data-bs-toggle="tooltip" data-bs-placement="top" title="Power Level: ${power}">`;
    }
    return powerHtml;
}
