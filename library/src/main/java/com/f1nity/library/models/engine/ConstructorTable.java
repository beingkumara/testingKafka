package com.f1nity.library.models.engine;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructorTable {
    
    @JsonProperty("Constructors")
    private List<ErgastConstructor> constructors;

    public List<ErgastConstructor> getConstructors() {
        return constructors;
    }

    public void setConstructors(List<ErgastConstructor> constructors) {
        this.constructors = constructors;
    }

    @Override
    public String toString() {
        return "ConstructorTable [constructors=" + constructors + "]";
    }
}