create table ANSWERS
(
    answer_id   varchar(32) not null
        primary key,
    user_id     varchar(32) not null,
    question_id varchar(32) not null,
    option_ids  text        null,
    content     text        null,
    created_at  datetime    not null,
    updated_at  datetime    not null,
    mark        float(5, 2) null
);

create table ASSFILES
(
    file_id       varchar(32)  not null
        primary key,
    assignment_id varchar(32)  not null,
    title         varchar(255) not null,
    source        varchar(255) not null,
    created_at    datetime     null
);

create table ASSIGNMENTS
(
    assignment_id varchar(32)  not null
        primary key,
    course_id     varchar(32)  not null,
    title         varchar(255) not null,
    description   longtext     not null,
    start         datetime     not null,
    end           datetime     not null,
    created_at    datetime     not null,
    updated_at    datetime     not null,
    mark          float(5, 2)  not null
);

create table CATEGORIES
(
    category_id   varchar(32)  not null
        primary key,
    category_name varchar(255) not null,
    created_by    varchar(32)  not null,
    created_at    datetime     not null
);

create table COURSES
(
    course_id   varchar(32)  not null
        primary key,
    title       varchar(255) not null,
    category_id varchar(32)  not null,
    cover       varchar(255) not null,
    created_by  varchar(32)  not null,
    updated_by  varchar(32)  not null,
    created_at  datetime     not null,
    updated_at  datetime     not null,
    has_forum   tinyint(1)   not null,
    description text         not null
);

create table POSTS
(
    post_id     varchar(32)  not null
        primary key,
    course_id   varchar(32)  not null,
    post_by     varchar(32)  not null,
    title       varchar(255) not null,
    content     longtext     not null,
    created_at  datetime     not null,
    updated_at  datetime     not null,
    category_id varchar(32)  not null
);

create table POST_CATEGORIES
(
    category_id varchar(32)  not null
        primary key,
    course_id   varchar(32)  not null,
    name        varchar(255) not null,
    created_at  datetime     not null,
    updated_at  datetime     not null,
    color       varchar(255) not null
);

create table QUESTIONS
(
    question_id  varchar(32)  not null
        primary key,
    quiz_id      varchar(32)  not null,
    cover        varchar(255) null,
    type         int          not null,
    mark         float(5, 2)  null,
    content      text         not null,
    created_at   datetime     not null,
    updated_at   datetime     not null,
    a            text         null,
    b            text         null,
    c            text         null,
    d            text         null,
    e            text         null,
    f            text         null,
    a_correct    tinyint      null,
    b_correct    tinyint      null,
    c_correct    tinyint      null,
    d_correct    tinyint      null,
    e_correct    tinyint      null,
    f_correct    tinyint      null,
    short_answer text         null
);

create table QUICK_QUIZZES
(
    quiz_id    varchar(32) not null
        primary key,
    limitation int         not null,
    stream_id  varchar(32) not null,
    created_at datetime    not null
);

create table QUICK_QUIZ_ANSWERS
(
    answer_id  varchar(32)  not null
        primary key,
    quiz_id    varchar(32)  not null,
    answer_by  varchar(32)  not null,
    answers    varchar(255) not null,
    created_at datetime     not null
);

create table QUICK_QUIZ_QUESTIONS
(
    question_id varchar(32)  not null
        primary key,
    quiz_id     varchar(32)  not null,
    mark        int          null,
    type        tinyint(1)   not null,
    question    varchar(255) not null,
    option_a    varchar(255) not null,
    option_b    varchar(255) not null,
    option_c    varchar(255) null,
    option_d    varchar(255) null,
    answer      varchar(255) not null,
    created_at  datetime     not null,
    sort        int          not null
);

create table QUIZZES
(
    quiz_id    varchar(32)  not null
        primary key,
    course_id  varchar(32)  not null,
    title      varchar(255) not null,
    limitation int          not null,
    start      datetime     not null,
    end        datetime     not null,
    created_at datetime     not null,
    updated_at datetime     not null
);

create table REPLIES
(
    reply_id   varchar(32) not null
        primary key,
    post_id    varchar(32) not null,
    reply_by   varchar(32) not null,
    parent_id  varchar(32) null,
    content    longtext    not null,
    created_at datetime    not null,
    updated_at datetime    not null,
    reply_to   varchar(32) null
);

create table RESOURCES
(
    resource_id varchar(32)  not null
        primary key,
    title       varchar(255) not null,
    source      varchar(255) not null,
    type        tinyint(1)   not null,
    created_by  varchar(32)  not null,
    created_at  datetime     not null,
    section_id  varchar(32)  not null
);

create table SECTIONS
(
    section_id   varchar(32)  not null
        primary key,
    title        varchar(255) not null,
    description  longtext     not null,
    cover        varchar(255) null,
    type         tinyint(1)   not null,
    created_by   varchar(32)  not null,
    updated_by   varchar(32)  not null,
    created_at   datetime     not null,
    updated_at   datetime     not null,
    youtube_link varchar(255) null,
    course_id    varchar(32)  not null
);

create table STAFFS
(
    staff_id   varchar(32) not null
        primary key,
    user_id    varchar(32) not null,
    course_id  varchar(32) not null,
    created_at datetime    not null
);

create table STREAMS
(
    stream_id   varchar(32)  not null
        primary key,
    title       varchar(255) not null,
    description longtext     not null,
    start       datetime     not null,
    end         datetime     not null,
    created_by  varchar(32)  not null,
    updated_by  varchar(32)  not null,
    created_at  datetime     not null,
    updated_at  datetime     not null,
    course_id   varchar(32)  not null
);

create table STUDENTS
(
    student_id varchar(32) not null
        primary key,
    user_id    varchar(32) not null,
    course_id  varchar(32) not null,
    created_at datetime    not null
);

create table SUBMITS
(
    submit_id     varchar(32)  not null
        primary key,
    assignment_id varchar(32)  not null,
    name          varchar(255) not null,
    source        varchar(255) not null,
    mark          float(5, 2)  null,
    created_at    datetime     not null,
    submitted_by  varchar(32)  not null
);

create table USERS
(
    user_id    varchar(32)  not null
        primary key,
    username   varchar(100) not null,
    password   varchar(64)  not null,
    email      varchar(255) not null,
    avatar     varchar(255) not null,
    created_at datetime     not null,
    updated_at datetime     not null
)
    comment 'User are the people who have registered on this website.';

