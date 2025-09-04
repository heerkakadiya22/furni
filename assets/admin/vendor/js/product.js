// ===== Sub Images Upload with Preview and Removal =====
(function () {
  const addBtn = document.getElementById("addSubImgBtn");
  const subImgContainer = document.getElementById("subImgContainer");
  const hiddenInputsContainer = document.getElementById("subImgInputs");

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  addBtn.addEventListener("click", () => {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "image/*";
    picker.multiple = true;
    picker.style.display = "none";
    document.body.appendChild(picker);

    picker.addEventListener("change", () => {
      if (!picker.files || picker.files.length === 0) {
        picker.remove();
        return;
      }

      Array.from(picker.files).forEach((file) => {
        const id = uid();

        const dt = new DataTransfer();
        dt.items.add(file);
        const hidden = document.createElement("input");
        hidden.type = "file";
        hidden.name = "sub_img";
        hidden.files = dt.files;
        hidden.dataset.uid = id;
        hiddenInputsContainer.appendChild(hidden);

        const reader = new FileReader();
        reader.onload = (e) => {
          const wrap = document.createElement("div");
          wrap.className = "sub-img-preview";
          wrap.dataset.uid = id;
          wrap.innerHTML = `
            <img src="${e.target.result}" width="100">
            <button type="button" class="remove-btn" aria-label="Remove image">×</button>
          `;

          subImgContainer.insertBefore(wrap, addBtn);

          wrap.querySelector(".remove-btn").addEventListener("click", () => {
            wrap.remove();
            const corresponding = hiddenInputsContainer.querySelector(
              'input[data-uid="' + id + '"]'
            );
            if (corresponding) corresponding.remove();
          });
        };
        reader.readAsDataURL(file);
      });

      picker.remove();
    });

    picker.click();
  });
})();

// ===== Main Image Upload with Preview =====
const dropZone = document.getElementById("dropZone");
const inputFile = document.getElementById("main_img");
const dropZoneText = document.getElementById("dropZoneText");

dropZone.addEventListener("click", () => inputFile.click());

inputFile.addEventListener("change", function () {
  if (this.files.length) {
    previewFile(this.files[0]);
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drop-zone-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drop-zone-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drop-zone-over");
  if (e.dataTransfer.files.length) {
    inputFile.files = e.dataTransfer.files;
    previewFile(e.dataTransfer.files[0]);
  }
});

function previewFile(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const preview = document.getElementById("mainImgPreview");
    if (preview) {
      preview.src = e.target.result;
    } else {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-img");
      img.id = "mainImgPreview";
      dropZone.appendChild(img);
    }
  };
  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
  // ===== Color Picker =====
  const colorPicker = document.getElementById("colorPicker");
  if (colorPicker) {
    const colorHex = document.getElementById("colorHex");
    const colorHidden = document.getElementById("colorHidden");

    colorPicker.addEventListener("input", () => {
      colorHex.value = colorPicker.value.toUpperCase();
      colorHidden.value = colorPicker.value.toUpperCase();
    });
  }

  // ===== Froala Editor =====
  const desc = document.querySelector("#description");
  if (desc) {
    new FroalaEditor(desc, {
      heightMin: 200,
      heightMax: 400,
      toolbarButtons: [
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "|",
        "formatOL",
        "formatUL",
        "|",
        "insertLink",
        "insertImage",
        "|",
        "undo",
        "redo",
      ],
    });
  }
});
