module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,

        },
        provide: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        timestamps: true, //생성, 수정일 자동등록
        paranoid: true,//삭제 시간 자동 등록(복구용)
        charset:'utf8',
        collate:'utf8_general_ci'
    })
);
//catsbi 25 2020-01-01 2020-04-08(삭제일) 이 있기 떄문에 삭제된 ROW
//catsbi 25 2020-01-01 NULL  삭제일이 없기 때문에 삭제되지 않은 ROW
/**
 * 이메일/ 닉네임/ 비밀번호/ 가입경로/
 */