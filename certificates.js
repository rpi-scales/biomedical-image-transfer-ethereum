$(document).ready(function () {
    const ipfs = window.IpfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    const Buffer = window.IpfsApi().Buffer;
    const ContractAddress = "0x0A11aE2a58859270204CC6121E0D76c2D12E8e69";
    if (typeof web3 === "undefined") {
        return showError("Please install MetaMask.");
    }
    const contract = web3.eth.contract(Config.getContractABI()).at(ContractAddress);

    function uploadCertificate() {
        //TODO: Write the Logic behind Uploading a Certificate to IPFS and adding the information to the Blockchain
        if ($('#CertificateForUpload')[0].files.length === 0) {
            return showError("Please select a file.");
        }
        let fileReader = new FileReader();

        fileReader.onload = function () {
            let fileBuffer = Buffer.from(fileReader.result);

            ipfs.files.add(fileBuffer, (err, result) => {
                if (err) {
                    return showError(err);
                }
                if (result) {
                    let ipfsHash = result[0].hash;
                    contract.addCertificate(ipfsHash, function (err, result) {
                        if (err) {
                            return showError(`There was error with the Smart Contract: ${err}`)
                        }
                        showInfo(`Certificate ${ipfsHash} was <b> successfully added to the Registry.`)
                    })
                }
            });
        };

        fileReader.readAsArrayBuffer($('#CertificateForUpload')[0].files[0]);
    }

    function viewGetCertificates() {
        //TODO: Write the logic behind View Certificates.
        contract.getCertificatesCount(function (err, result) {
            if (err) {
                return showError(`There was an error with the Contract: ${err}`);
            }

            let certificatesCount = result.toNumber();

            if (certificatesCount > 0) {
                let html = $('<div>');

                for (let index = 0; index < certificatesCount; index++) {
                    contract.getCertificate(index, function (err, result) {
                        if (err) {
                            return showError(`There was an error with the Contract: ${err}`);
                        }

                        let ipfsImageHash = result[0];
                        let certificatePublishDate = result[1];

                        let divElement = $('<div>');
                        let imageUrl = `https://ipfs.infura.io/ipfs/${ipfsImageHash}`;
                        let displayDate = new Date(certificatePublishDate * 1000).toLocaleString();

                        divElement
                            .append($(`<p>Certificate published on: ${displayDate}</p>`))
                            .append($(`img src=${imageUrl} />`));

                        html.append(divElement);
                    });
                }

                html.append('</div>');
                $('#viewGetCertificates').append(html);
            } else {
                $('#viewGetCertificates').append(`<div>No certificates in our Smart Contract</div>`);
            }
        }) 

    }
    $('#linkHome').click(function () {
        showView("viewHome")
    });
    $('#linkSubmitCertificate').click(function () {
        showView("viewSubmitCertificate")
    });
    $('#linkGetCertificates').click(function () {
        $('#viewGetCertificates div').remove();
        showView("viewGetCertificates");
        viewGetCertificates();
    });
    $('#CertificateUploadButton').click(uploadCertificate);

// Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").show()
        },
        ajaxStop: function () {
            $("#loadingBox").hide()
        }
    });

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
    }

    function showInfo(message) {
        $('#infoBox>p').html(message);
        $('#infoBox').show();
        $('#infoBox>header').click(function () {
            $('#infoBox').hide();
        });
    }

    function showError(errorMsg) {
        $('#errorBox>p').html("Error: " + errorMsg);
        $('#errorBox').show();
        $('#errorBox>header').click(function () {
            $('#errorBox').hide();
        });
    }

});



