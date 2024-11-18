import { Db, EducationalCourse, EducationalCourseWithoutId } from "@/app/types";
import { pickRandom } from "@/app/utils";

class EducationalCoursesService {
  constructor(db: Db) {
    this.db = db;
  }

  async findPassedCoursesByLecturerName(
    lecturerName: string
  ): Promise<EducationalCourse[]> {
    const statement = await this.db.prepareAsync(
      `SELECT * FROM educational_courses WHERE lecturerName = $lecturerName AND mark >= 60`
    );

    const result = await statement.executeAsync({
      $lecturerName: lecturerName,
    });

    return (await result.getAllAsync()) as EducationalCourse[];
  }

  async findAll(): Promise<EducationalCourse[]> {
    const result = await this.db.getAllAsync(
      "SELECT * FROM educational_courses"
    );

    return result as EducationalCourse[];
  }

  async getAverageMark(): Promise<number> {
    const result = await this.db.getFirstAsync(
      "SELECT AVG(mark) as averageMark FROM educational_courses"
    );

    return (result as any).averageMark;
  }

  async findOneRandom(): Promise<EducationalCourse> {
    const result = await this.db.getFirstAsync(
      "SELECT * FROM educational_courses ORDER BY RANDOM() LIMIT 1"
    );

    return result as EducationalCourse;
  }

  async createCourse(course: EducationalCourseWithoutId) {
    const statement = await this.db.prepareAsync(
      `INSERT INTO educational_courses (name, lecturerName, buildingAddress, mark, buildingLatitude, buildingLongitude)
      VALUES ($name, $lecturerName, $buildingAddress, $mark, $buildingLatitude, $buildingLongitude)`
    );

    await statement.executeAsync({
      $name: course.name,
      $lecturerName: course.lecturerName,
      $buildingAddress: course.buildingAddress,
      $mark: course.mark,
      $buildingLatitude: course.buildingLatitude,
      $buildingLongitude: course.buildingLongitude,
    });
  }

  async initialize() {
    await this.createTable();

    if (await this.areNoCourses()) {
      await this.seedData();
    }
  }

  async reset() {
    await this.dropTable();
    await this.createTable();
    await this.seedData();
  }

  private async areNoCourses(): Promise<boolean> {
    const row = await this.db.getFirstAsync(
      "SELECT 1 FROM educational_courses LIMIT 1"
    );

    return !row;
  }

  private async createTable(): Promise<void> {
    await this.db.execAsync(`
CREATE TABLE IF NOT EXISTS educational_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lecturerName TEXT NOT NULL,
  buildingAddress TEXT NOT NULL,
  buildingLatitude REAL NOT NULL,
  buildingLongitude REAL NOT NULL,
  mark INTEGER NOT NULL
)`);
  }

  private async dropTable(): Promise<void> {
    await this.db.execAsync("DROP TABLE IF EXISTS educational_courses");
  }

  private async seedData(): Promise<void> {
    await Promise.all(
      this.getSeedCourses().map((course) => this.createCourse(course))
    );
  }

  private getSeedCourses(): EducationalCourseWithoutId[] {
    return this.getPossibleCourseNames().map((name) => {
      const { latitude, longitude, address } = this.getRandomLocation();

      return {
        name,
        lecturerName: this.getRandomLecturerName(),
        buildingAddress: address,
        buildingLatitude: latitude,
        buildingLongitude: longitude,
        mark: this.getRandomMark(),
      };
    });
  }

  private getRandomLecturerName(): string {
    const possibleNames = [
      "Кондратюк Ю.В.",
      "Кнопов П.С.",
      "Савчук М.М.",
      "Слабоспицький О.С.",
      "Шарапов М.М.",
      "Анісімов А.В.",
      "Терещенко В.М.",
      "Заславський В.А.",
      "Глибовець М.М.",
      "Тимашова Л.А.",
      "Панченко Т.В.",
      "Нікітченко М.С.",
      "Дорошенко А.Ю.",
      "Шкільняк С.С.",
      "Зубенко В.В.",
      "Провотар О.І.",
      "Єршов С.В.",
      "Кривий С.Л.",
      "Стецюк П.І.",
      "Верес М.М.",
    ];

    return pickRandom(possibleNames);
  }

  private getRandomMark(): number {
    return Math.floor(Math.random() * 100);
  }

  private getPossibleCourseNames(): string[] {
    const possibleNames = [
      "Математична статистика",
      "Основи дослідження операцій",
      "Дослідження операцій",
      "Архітектура обчислювальних систем та комп'ютерні мережі",
      "Чисельні методи",
      "Теорія програмування",
      "Алгебраїчні структури, криптографія та захист інформації",
      "Обчислювальна геометрія та комп'ютерна графіка",
      "Теорія керування та основи робототехніки",
      "Розподілене та паралельне програмування",
      "Інтелектуальні системи",
      "Основи квантових обчислень",
      "Побудова та аналіз алгоритмів",
      "Основи криптографії",
      "Основи комп'ютерної лінгвістики",
      "Нейронні мережі",
      "Сучасні технології машинного навчання",
      "Системи паралельного програмування",
      "Основи розпізнавання образів",
      "WEB-технології",
      "Методи специфікації та верифікації програм",
      "Парадигми та технології програмування",
      "Інформаційні технології та правовий захист",
    ];

    return possibleNames;
  }

  private getRandomLocation(): {
    latitude: number;
    longitude: number;
    address: string;
  } {
    const possibleLocations = [
      {
        address: "м. Київ, вул. Володимирська, 60",
        latitude: 50.44205,
        longitude: 30.51114,
      },
      {
        address: "м. Київ, просп. Академіка Глушкова, 4-Е",
        latitude: 50.38275,
        longitude: 30.47538,
      },
      {
        address: "м. Київ, вул. Васильківська, 90",
        latitude: 50.39413,
        longitude: 30.49274,
      },
      {
        address: "м. Київ, просп. Академіка Глушкова, 2",
        latitude: 50.38203,
        longitude: 30.47034,
      },
      {
        address: "м. Київ, вул. Богдана Гаврилишина, 24",
        latitude: 50.46671,
        longitude: 30.48444,
      },
      {
        address: "м. Київ, просп. Академіка Глушкова, 4-Д",
        latitude: 50.38301,
        longitude: 30.47488,
      },
      {
        address: "м. Київ, просп. Академіка Глушкова, 4-Г",
        latitude: 50.38321,
        longitude: 30.4751,
      },
      {
        address: "м. Київ, вул. Льва Толстого, 14-А",
        latitude: 50.43765,
        longitude: 30.50599,
      },
      {
        address: "м. Київ, вул. Драгоманова, 3",
        latitude: 50.39628,
        longitude: 30.61305,
      },
      {
        address: "м. Київ, вул. Мельникова, 36/1",
        latitude: 50.47079,
        longitude: 30.45818,
      },
      {
        address: "м. Київ, вул. Тарасівська, 16",
        latitude: 50.43275,
        longitude: 30.51214,
      },
      {
        address: "м. Київ, вул. Васильківська, 36",
        latitude: 50.40491,
        longitude: 30.51873,
      },
      {
        address: "м. Київ, вул. Симона Петлюри, 36",
        latitude: 50.44041,
        longitude: 30.49034,
      },
    ];

    return pickRandom(possibleLocations);
  }

  private db: Db;
}

export { EducationalCoursesService };
