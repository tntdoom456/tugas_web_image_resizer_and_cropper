$(document).ready(function () {
    const dataResolusi = [
        { tujuan: "Foto Profil", lebar: 800, tinggi: 800, rasio: "1:1", badge: "bg-secondary" },
        { tujuan: "Banner Website", lebar: 1200, tinggi: 400, rasio: "3:1", badge: "bg-info text-dark" },
        { tujuan: "Thumbnail YouTube", lebar: 1280, tinggi: 720, rasio: "16:9", badge: "bg-danger" },
        { tujuan: "Postingan Instagram", lebar: 1080, tinggi: 1080, rasio: "1:1", badge: "bg-success" },
        { tujuan: "Custom (Ukuran Bebas)", lebar: 0, tinggi: 0, rasio: "?", badge: "bg-dark" } // Opsi Custom ditambahkan
    ];

    function renderTabelResolusi() {
        const tbody = document.getElementById("tbody-resolusi");
        if (!tbody) return; // Keluar jika bukan di halaman index
        
        tbody.innerHTML = ""; 
        
        dataResolusi.forEach(function(item) {
            const tr = document.createElement("tr");
            
            tr.innerHTML = `
                <td class="fw-semibold">${item.tujuan}</td>
                <td>${item.lebar}</td>
                <td>${item.tinggi}</td>
                <td><span class="badge ${item.badge}">${item.rasio}</span></td>
                <td>
                    <a href="editor.html?w=${item.lebar}&h=${item.tinggi}" class="btn btn-sm btn-primary fw-bold">
                        Pilih Ukuran
                    </a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    renderTabelResolusi();


    /* =========================================================
       BAGIAN 2: MENANGKAP URL PARAMETER (editor_4.html)
    ========================================================= */
    
    // Mengambil nilai ?w=... dan ?h=... dari URL jika ada
    const urlParams = new URLSearchParams(window.location.search);
    const setW = urlParams.get('w');
    const setH = urlParams.get('h');

    // Jika parameter ditemukan (pengguna datang dari klik tombol di beranda)
    if (setW !== null && setH !== null) {
        $("#targetW").val(setW); // Isi input lebar
        $("#targetH").val(setH); // Isi input tinggi
    }


    /* =========================================================
       BAGIAN 3: ANIMASI JQUERY (detail_4.html)
    ========================================================= */
    $("#btn-toggle-catatan").on("click", function() {
        $("#form-catatan-container").slideToggle("slow");
        const teksTombol = $(this).text();
        if(teksTombol.includes("Sembunyikan")) {
            $(this).text("Tampilkan Form Catatan");
            $(this).removeClass("btn-danger").addClass("btn-outline-primary");
        } else {
            $(this).text("Sembunyikan Form Catatan");
            $(this).removeClass("btn-outline-primary").addClass("btn-danger");
        }
    });


    /* =========================================================
       BAGIAN 4: LOGIKA CROPPER JS (editor_4.html)
    ========================================================= */
    let cropper;
    const $areaPratinjau =$("#area-pratinjau");

    if ($areaPratinjau.length > 0) {$areaPratinjau.hide(); 
    }

    $("#imageLoader").on("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        $areaPratinjau.fadeIn("slow");

        const reader = new FileReader();
        reader.onload = function (event) {
            const imageElement = document.getElementById('image');
            imageElement.src = event.target.result;
            
            document.getElementById('result').src = "";
            $("#btn-download").hide();
            
            if (cropper) { cropper.destroy(); }

            // Mengambil ukuran dari input box (yang mungkin sudah diisi otomatis oleh URL Parameter)
            const width = parseInt($("#targetW").val()) || 1;
            const height = parseInt($("#targetH").val()) || 1;
            
            cropper = new Cropper(imageElement, {
                aspectRatio: width / height, 
                viewMode: 1,
                dragMode: 'move' 
            });
        };
        reader.readAsDataURL(file);
    });

    $("#btn-update-ratio").on("click", function(e) {
        e.preventDefault(); 
        if (!cropper) {
            alert("Harap pilih gambar terlebih dahulu!"); 
            return;
        }
        const width = parseInt($("#targetW").val()) || 1;
        const height = parseInt($("#targetH").val()) || 1;
        cropper.setAspectRatio(width / height);
    });

    $("#btn-crop").on("click", function(e) {
        e.preventDefault();
        if (!cropper) {
            alert("Gambar belum dipilih!");
            return;
        }
        const width = parseInt($("#targetW").val());
        const height = parseInt($("#targetH").val());
        const canvas = cropper.getCroppedCanvas({ width: width, height: height });
        document.getElementById('result').src = canvas.toDataURL('image/png');
        $("#btn-download").fadeIn("slow");
    });

    $("#btn-download").on("click", function(e) {
        e.preventDefault();
        const resultSrc = document.getElementById('result').src;
        if (!resultSrc || resultSrc.includes("placeholder")) return;
        const link = document.createElement('a');
        link.download = 'cropped-image.png'; 
        link.href = resultSrc;         
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});