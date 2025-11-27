document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'kyu' && password === '123') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('adminPage').style.display = 'flex';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
    } else {
        alert('Username atau password salah!');
    }
});

window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('adminPage').style.display = 'flex';
        
        const username = localStorage.getItem('username') || 'Kyu';
        document.querySelector('.user-name').textContent = username;
        document.querySelector('.welcome-content h2').textContent = `Selamat Datang, ${username}!`;
    } else {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('adminPage').style.display = 'none';
    }
});

document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    document.getElementById('adminPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-links a').forEach(item => {
            item.classList.remove('active');
        });
        
        this.classList.add('active');
        
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        
        document.querySelector('.page-title h1').textContent = this.querySelector('span').textContent;
    });
});

document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
});

document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth <= 768 && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target) && 
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

document.querySelectorAll('.btn-delete[data-post]').forEach(button => {
    button.addEventListener('click', function() {
        const postId = this.getAttribute('data-post');
        showConfirmationModal('Hapus postingan ini? Tindakan ini tidak dapat dibatalkan.', function() {
            const postRow = document.querySelector(`.btn-delete[data-post="${postId}"]`).closest('tr');
            postRow.remove();
            alert('Postingan berhasil dihapus!');
        });
    });
});

document.querySelectorAll('.btn-delete[data-event]').forEach(button => {
    button.addEventListener('click', function() {
        const eventId = this.getAttribute('data-event');
        showConfirmationModal('Hapus event ini? Tindakan ini tidak dapat dibatalkan.', function() {
            const eventRow = document.querySelector(`.btn-delete[data-event="${eventId}"]`).closest('tr');
            eventRow.remove();
            alert('Event berhasil dihapus!');
        });
    });
});

document.querySelectorAll('.btn-warning, .btn-delete[data-action="ban"], .btn-edit[data-action="unban"]').forEach(button => {
    button.addEventListener('click', function() {
        const userId = this.getAttribute('data-user');
        const action = this.getAttribute('data-action');
        let message = '';
        let callback;
        
        if (action === 'warning') {
            message = 'Berikan peringatan kepada pengguna ini?';
            callback = function() {
                const userRow = document.querySelector(`[data-user="${userId}"]`).closest('tr');
                const statusCell = userRow.querySelector('.status');
                statusCell.textContent = 'Warning';
                statusCell.className = 'status warning';
                alert('Peringatan telah diberikan kepada pengguna!');
            };
        } else if (action === 'ban') {
            message = 'Blokir pengguna ini? Tindakan ini tidak dapat dibatalkan.';
            callback = function() {
                const userRow = document.querySelector(`[data-user="${userId}"]`).closest('tr');
                const statusCell = userRow.querySelector('.status');
                statusCell.textContent = 'Banned';
                statusCell.className = 'status banned';
                alert('Pengguna telah diblokir!');
            };
        } else if (action === 'unban') {
            message = 'Buka blokir pengguna ini?';
            callback = function() {
                const userRow = document.querySelector(`[data-user="${userId}"]`).closest('tr');
                const statusCell = userRow.querySelector('.status');
                statusCell.textContent = 'Aktif';
                statusCell.className = 'status online';
                alert('Pengguna telah dibuka blokirnya!');
            };
        }
        
        showConfirmationModal(message, callback);
    });
});

function showConfirmationModal(message, confirmCallback) {
    const modal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const closeModal = document.querySelector('.close-modal');
    
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    
    const closeModalFunc = function() {
        modal.style.display = 'none';
        modalCancel.removeEventListener('click', closeModalFunc);
        modalConfirm.removeEventListener('click', confirmHandler);
        closeModal.removeEventListener('click', closeModalFunc);
    };
    
    const confirmHandler = function() {
        confirmCallback();
        closeModalFunc();
    };
    
    modalCancel.addEventListener('click', closeModalFunc);
    modalConfirm.addEventListener('click', confirmHandler);
    closeModal.addEventListener('click', closeModalFunc);
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunc();
        }
    });
}

const miniDonationCtx = document.getElementById('miniDonationChart');
if (miniDonationCtx) {
    const miniDonationChart = new Chart(miniDonationCtx, {
        type: 'bar',
        data: {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [{
                label: 'Donasi Harian (Rp)',
                data: [450000, 620000, 780000, 910000, 1070000, 1200000, 1350000],
                backgroundColor: [
                    'rgba(139, 107, 77, 0.7)',
                    'rgba(139, 107, 77, 0.7)',
                    'rgba(139, 107, 77, 0.7)',
                    'rgba(139, 107, 77, 0.7)',
                    'rgba(139, 107, 77, 0.7)',
                    'rgba(143, 188, 143, 0.7)',
                    'rgba(143, 188, 143, 0.7)'
                ],
                borderColor: [
                    'rgba(139, 107, 77, 1)',
                    'rgba(139, 107, 77, 1)',
                    'rgba(139, 107, 77, 1)',
                    'rgba(139, 107, 77, 1)',
                    'rgba(139, 107, 77, 1)',
                    'rgba(143, 188, 143, 1)',
                    'rgba(143, 188, 143, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Rp ${(context.parsed.y / 1000).toFixed(0)}rb`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + (value / 1000).toFixed(0) + 'rb';
                        }
                    }
                }
            }
        }
    });
}

const donationCtx = document.getElementById('donationChart');
if (donationCtx) {
    const donationChart = new Chart(donationCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{
                label: 'Donasi (dalam juta Rupiah)',
                data: [3.2, 2.8, 4.1, 3.5, 4.8, 3.9, 4.5, 5.2, 4.7, 5.25],
                borderColor: '#8B6B4D',
                backgroundColor: 'rgba(139, 107, 77, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Rp ${context.parsed.y} Juta`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + value + ' Jt';
                        }
                    }
                }
            }
        }
    });
}
