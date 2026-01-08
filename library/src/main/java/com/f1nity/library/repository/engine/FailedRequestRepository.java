package com.f1nity.library.repository.engine;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.f1nity.library.models.engine.FailedRequest;

public interface FailedRequestRepository extends MongoRepository<FailedRequest, String> {
    List<FailedRequest> findByProcessedFalse();
}
