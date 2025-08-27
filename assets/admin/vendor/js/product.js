  const subImgInput = document.getElementById("sub_img");
            const subImgContainer = document.getElementById("subImgContainer");

            subImgInput.addEventListener("change", function () {
                const files = Array.from(this.files);

                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function (e) {

                        const wrapper = document.createElement("div");
                        wrapper.classList.add("sub-img-preview");

                        const img = document.createElement("img");
                        img.src = e.target.result;

                        const removeBtn = document.createElement("button");
                        removeBtn.innerHTML = "×";
                        removeBtn.classList.add("remove-btn");
                        removeBtn.onclick = function () {
                            wrapper.remove();
                        };

                        wrapper.appendChild(img);
                        wrapper.appendChild(removeBtn);

                        subImgContainer.insertBefore(wrapper, subImgContainer.querySelector(".sub-img-upload"));
                    };
                    reader.readAsDataURL(file);
                });
            });

            document.querySelectorAll(".replace-input").forEach(input => {
                input.addEventListener("change", function () {
                    const file = this.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.previousElementSibling.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            });


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