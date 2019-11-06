pragma solidity ^0.4.25;

contract CertificatesRegistry {

    struct Certificate {
        string hash;
        uint256 dateAdded;
    }

    Certificate[] private certificates;

    function addCertificate(string _hash) public {
        uint dateAdded = block.timestamp;
        Certificate memory newCertificate = Certificate(_hash, dateAdded);
        certificates.push(newCertificate);
    }

    function getCertificatesCount() public view returns (uint) {
        return certificates.length;
    }

    function getCertificate(uint _index) public view returns(string, uint) {
        Certificate memory certificate = certificates[_index];
        return (certificate.hash, certificate.dateAdded);
    }

}


