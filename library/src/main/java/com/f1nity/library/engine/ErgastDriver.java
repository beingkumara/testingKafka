package com.f1nity.library.engine;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ErgastDriver {
    
    private String driverId;
    private String permanentNumber;
    private String code;
    private String url;
    private String givenName;
    private String familyName;
    private String dateOfBirth;
    private String nationality;
    public String getDriverId() {
        return driverId;
    }
    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }
    public String getPermanentNumber() {
        return permanentNumber;
    }
    public void setPermanentNumber(String permanentNumber) {
        this.permanentNumber = permanentNumber;
    }
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getGivenName() {
        return givenName;
    }
    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }
    public String getFamilyName() {
        return familyName;
    }
    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }
    public String getDateOfBirth() {
        return dateOfBirth;
    }
    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    public String getNationality() {
        return nationality;
    }
    public void setNationality(String nationality) {
        this.nationality = nationality;
    }
    @Override
    public String toString() {
        return "ErgastDriver [driverId=" + driverId + ", permanentNumber=" + permanentNumber + ", code=" + code
                + ", url=" + url + ", givenName=" + givenName + ", familyName=" + familyName + ", dateOfBirth="
                + dateOfBirth + ", nationality=" + nationality + "]";
    }


    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ErgastResponse {
        public MRData MRData;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MRData {
        public DriverTable DriverTable;
        public RaceTable RaceTable;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DriverTable {
        public List<ErgastDriver> Drivers;
    }




    
}
