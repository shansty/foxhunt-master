package com.itechart.foxhunt.api.location.service;

import com.github.javafaker.Faker;
import com.itechart.foxhunt.api.AbstractMigrationTest;
import com.itechart.foxhunt.api.location.dao.LocationRepository;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

import static org.junit.jupiter.api.Assertions.assertEquals;


@Transactional
public class OrganizationLocationServiceImplIntTest extends AbstractMigrationTest {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Faker FAKER = Faker.instance(Locale.ENGLISH, ThreadLocalRandom.current());

    private static final Integer RANDOM_DIGIT = FAKER.number().randomDigit();

    private static final String RANDOM_STR = FAKER
        .letterify("Ab?c?D?d?zF?a0?m?d?+?" + RANDOM_DIGIT); // used for name (unique & >=5 characters)

    @Test
    public void shouldCreateLocationCheckingByName() {
        final LocationEntity fakeEntity = fakeLocationEntity();
        locationRepository.save(fakeEntity);

        final LocationEntity locationFound = locationRepository.findByName(RANDOM_STR)
            .orElseThrow(EntityNotFoundException::new);

        fakeEntity.setId(locationFound.getId());
        fakeEntity.setCreatedDate(locationFound.getCreatedDate());

        assertEquals(fakeEntity, locationFound);
    }

    private LocationEntity fakeLocationEntity() {
        final GeometryFactory geomFactory = new GeometryFactory();
        final Point point = geomFactory.createPoint(new Coordinate(53.907, 27.567));
        final Coordinate[] coorArr = {new Coordinate(53.905090975582205, 27.5667970453114),
            new Coordinate(53.906560763601604, 27.570316103538957),
            new Coordinate(53.90782778053748, 27.567569521507686),
            new Coordinate(53.90706757500942, 27.565595415672725),
            new Coordinate(53.905090975582205, 27.5667970453114)};
        final Polygon polygon = geomFactory.createPolygon(coorArr);
        final LocationEntity newLocationEntity = new LocationEntity();
        newLocationEntity.setZoom((byte) 5);
        newLocationEntity.setCenter(point);
        newLocationEntity.setCoordinates(polygon);
        newLocationEntity.setName(RANDOM_STR);
        newLocationEntity.setIsGlobal(true);
        newLocationEntity.setIsCloned(false);

        UserEntity userEntity = fakeUserEntity();
        userRepository.save(userEntity);
        newLocationEntity.setCreatedBy(userEntity);

        return newLocationEntity;
    }

    private UserEntity fakeUserEntity() {
        UserEntity userEntity = new UserEntity();
        userEntity.setActivated(true);
        String email = RANDOM_STR + "@mail.com";
        userEntity.setEmail(email);
        return userEntity;
    }
}
